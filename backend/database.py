import sqlite3
import os
from contextlib import contextmanager

DB_PATH = os.environ.get("DB_PATH", os.path.join(os.path.dirname(__file__), "missao_saude.db"))


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


@contextmanager
def db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    with db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS avaliacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                unidade_id TEXT NOT NULL,
                atendimento_recepcao INTEGER NOT NULL DEFAULT 0,
                tempo_espera_recepcao INTEGER NOT NULL DEFAULT 0,
                tempo_espera_consulta INTEGER NOT NULL DEFAULT 0,
                infraestrutura INTEGER NOT NULL DEFAULT 0,
                elogio_retorno TEXT NOT NULL DEFAULT 'naoFez',
                comentario TEXT,
                ip_address TEXT,
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS admin_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                nome TEXT,
                senha_hash TEXT,
                google_id TEXT,
                role TEXT NOT NULL DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                admin_email TEXT,
                action TEXT NOT NULL,
                details TEXT,
                ip_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_avaliacoes_unidade ON avaliacoes(unidade_id);
            CREATE INDEX IF NOT EXISTS idx_avaliacoes_created ON avaliacoes(created_at);
            CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
        """)

    # Criar admin padrão se não existir nenhum
    _criar_admin_padrao()


def _criar_admin_padrao():
    import hashlib
    email_padrao = os.environ.get("ADMIN_EMAIL", "admin@santacasa.ilhabela.sp.gov.br")
    senha_padrao = os.environ.get("ADMIN_SENHA", "SantaCasa2024!")
    nome_padrao = os.environ.get("ADMIN_NOME", "Administrador")

    with db() as conn:
        existe = conn.execute(
            "SELECT id FROM admin_users WHERE email = ?", (email_padrao,)
        ).fetchone()

        if not existe:
            senha_hash = hashlib.sha256(senha_padrao.encode()).hexdigest()
            conn.execute(
                "INSERT INTO admin_users (email, nome, senha_hash) VALUES (?, ?, ?)",
                (email_padrao, nome_padrao, senha_hash),
            )


# ─── Avaliacoes ───────────────────────────────────────────────────────────────

def salvar_avaliacao(data: dict) -> dict:
    with db() as conn:
        cur = conn.execute(
            """INSERT INTO avaliacoes
               (unidade_id, atendimento_recepcao, tempo_espera_recepcao,
                tempo_espera_consulta, infraestrutura, elogio_retorno,
                comentario, ip_address, user_agent)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                data["unidade_id"],
                data.get("atendimento_recepcao", 0),
                data.get("tempo_espera_recepcao", 0),
                data.get("tempo_espera_consulta", 0),
                data.get("infraestrutura", 0),
                data.get("elogio_retorno", "naoFez"),
                data.get("comentario"),
                data.get("ip_address"),
                data.get("user_agent"),
            ),
        )
        row = conn.execute(
            "SELECT * FROM avaliacoes WHERE id = ?", (cur.lastrowid,)
        ).fetchone()
        return dict(row)


def obter_avaliacoes_unidade(unidade_id: str) -> list[dict]:
    with db() as conn:
        rows = conn.execute(
            "SELECT * FROM avaliacoes WHERE unidade_id = ? ORDER BY created_at DESC",
            (unidade_id,),
        ).fetchall()
        return [dict(r) for r in rows]


def obter_todas_avaliacoes(periodo_dias: int | None = None) -> list[dict]:
    with db() as conn:
        if periodo_dias:
            rows = conn.execute(
                "SELECT * FROM avaliacoes WHERE created_at >= datetime('now', ?) ORDER BY created_at DESC",
                (f"-{periodo_dias} days",),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM avaliacoes ORDER BY created_at DESC"
            ).fetchall()
        return [dict(r) for r in rows]


def obter_stats_unidade(unidade_id: str, periodo_dias: int | None = None) -> dict:
    with db() as conn:
        if periodo_dias:
            rows = conn.execute(
                """SELECT * FROM avaliacoes
                   WHERE unidade_id = ? AND created_at >= datetime('now', ?)
                   ORDER BY created_at DESC""",
                (unidade_id, f"-{periodo_dias} days"),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM avaliacoes WHERE unidade_id = ? ORDER BY created_at DESC",
                (unidade_id,),
            ).fetchall()

        rows = [dict(r) for r in rows]
        return _calcular_stats(rows)


def obter_todas_stats(periodo_dias: int | None = None) -> dict:
    avaliacoes = obter_todas_avaliacoes(periodo_dias)
    unidades: dict[str, list] = {}
    for av in avaliacoes:
        uid = av["unidade_id"]
        unidades.setdefault(uid, []).append(av)

    return {uid: _calcular_stats(lista) for uid, lista in unidades.items()}


def _calcular_stats(rows: list[dict]) -> dict:
    total = len(rows)
    if total == 0:
        return {
            "total_avaliacoes": 0,
            "media_geral": 0,
            "media_categorias": {"atendimento": 0, "limpeza": 0, "tempo_espera": 0, "estrutura": 0},
            "distribuicao": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
        }

    def media(campo):
        vals = [r[campo] for r in rows if r.get(campo, 0) > 0]
        return round(sum(vals) / len(vals), 1) if vals else 0

    atend = media("atendimento_recepcao")
    tempo = media("tempo_espera_recepcao")
    consulta = media("tempo_espera_consulta")
    infra = media("infraestrutura")

    media_geral = round((atend + tempo + consulta + infra) / 4, 1) if any([atend, tempo, consulta, infra]) else 0

    distribuicao = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for r in rows:
        nota = round(media_geral)
        if 1 <= nota <= 5:
            distribuicao[nota] += 1

    return {
        "total_avaliacoes": total,
        "media_geral": media_geral,
        "media_categorias": {
            "atendimento": atend,
            "limpeza": infra,
            "tempo_espera": round((tempo + consulta) / 2, 1) if tempo or consulta else 0,
            "estrutura": infra,
        },
        "distribuicao": distribuicao,
    }


# ─── Admin Users ──────────────────────────────────────────────────────────────

def autenticar_admin(email: str, senha: str) -> dict | None:
    import hashlib
    senha_hash = hashlib.sha256(senha.encode()).hexdigest()
    with db() as conn:
        row = conn.execute(
            "SELECT * FROM admin_users WHERE email = ? AND senha_hash = ?",
            (email, senha_hash),
        ).fetchone()
        if row:
            conn.execute(
                "UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
                (row["id"],),
            )
            return dict(row)
    return None


def obter_ou_criar_admin_google(google_id: str, email: str, nome: str) -> dict:
    with db() as conn:
        row = conn.execute(
            "SELECT * FROM admin_users WHERE email = ? OR google_id = ?",
            (email, google_id),
        ).fetchone()

        if row:
            conn.execute(
                "UPDATE admin_users SET google_id = ?, nome = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?",
                (google_id, nome, row["id"]),
            )
            return dict(row)

        # Verifica se email está na lista de admins permitidos
        emails_permitidos = os.environ.get("ADMIN_EMAILS_PERMITIDOS", "").split(",")
        emails_permitidos = [e.strip() for e in emails_permitidos if e.strip()]

        # Se não há lista ou email está na lista, cria admin
        if not emails_permitidos or email in emails_permitidos:
            conn.execute(
                "INSERT INTO admin_users (email, nome, google_id) VALUES (?, ?, ?)",
                (email, nome, google_id),
            )
            row = conn.execute(
                "SELECT * FROM admin_users WHERE email = ?", (email,)
            ).fetchone()
            return dict(row)

        return None


# ─── Audit ────────────────────────────────────────────────────────────────────

def registrar_auditoria(admin_email: str, action: str, details: str = "", ip: str = "") -> None:
    with db() as conn:
        conn.execute(
            "INSERT INTO audit_logs (admin_email, action, details, ip_address) VALUES (?, ?, ?, ?)",
            (admin_email, action, details, ip),
        )


def obter_audit_logs(limite: int = 100) -> list[dict]:
    with db() as conn:
        rows = conn.execute(
            "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?", (limite,)
        ).fetchall()
        return [dict(r) for r in rows]
