"""
Script de importação — Opção C
Lê todos os arquivos .xlsx da pasta e importa para o PostgreSQL.

Uso:
    python importar_xlsx.py
    python importar_xlsx.py --pasta ./bases --truncar

Instalar:
    pip install pandas openpyxl psycopg2-binary python-dotenv
"""

import os
import sys
import argparse
import pandas as pd
import psycopg2
import psycopg2.extras
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

# ─── MAPEAMENTO: coluna xlsx → coluna postgres ───
COLMAP = {
    'id':         'id',
    'unidade':    'unidade',
    'resposta':   'resposta',
    ' P01 ':      'pergunta1',
    '   P02 ':    'pergunta2',
    '  P03 ':     'pergunta3',
    'P04 ':       'pergunta4',
    'P05 ':       'pergunta5',
    'createdat':  'createdat',
    'updatedat':  'updatedat',
    # Nomes alternativos que podem aparecer
    'P01':        'pergunta1',
    'P02':        'pergunta2',
    'P03':        'pergunta3',
    'P04':        'pergunta4',
    'P05':        'pergunta5',
}

# Normalização de nomes de unidades
UNIDADE_MAP = {
    'CENTRO MUN ESP EM REABILITACAO E TRANST DO ESPECTRO AUTISTA': 'CER III TEA',
}

def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        options="-c client_encoding=UTF8"
    )

def garantir_tabela(conn):
    """Cria a tabela se não existir (compatível com a estrutura existente)."""
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS public.pesquisa (
                id                  BIGSERIAL PRIMARY KEY,
                unidade             TEXT,
                profissional        TEXT,
                especialidade       TEXT,
                procedimento        TEXT,
                codigo              TEXT,
                paciente            TEXT,
                cns                 TEXT,
                dn                  DATE,
                data                DATE,
                hora                TIME,
                telefone1           TEXT,
                idmsg               TEXT,
                status              TEXT,
                statussentmsg       TEXT,
                statusdeliveredmsg  TEXT,
                statusreadmsg       TEXT,
                statusfailedmsg     TEXT,
                tipomensagem        TEXT,
                resposta            TEXT,
                pergunta1           TEXT,
                pergunta2           TEXT,
                pergunta3           TEXT,
                pergunta4           TEXT,
                pergunta5           TEXT,
                analisedesentimentos TEXT,
                createdat           TIMESTAMP DEFAULT NOW(),
                updatedat           TIMESTAMP DEFAULT NOW()
            );
        """)
        # Índices úteis para o dashboard
        cur.execute("CREATE INDEX IF NOT EXISTS idx_pesquisa_unidade   ON public.pesquisa(unidade);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_pesquisa_createdat ON public.pesquisa(createdat);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_pesquisa_pergunta1 ON public.pesquisa(pergunta1);")
    conn.commit()
    print("✅ Tabela verificada/criada com sucesso.")

def limpar_valor(v):
    if pd.isna(v):
        return None
    if isinstance(v, str):
        return v.strip() or None
    return v

def importar_arquivo(conn, caminho: Path, truncar_primeiro: bool = False):
    print(f"\n📂 Lendo: {caminho.name}")

    # Detectar aba correta
    xl = pd.ExcelFile(caminho)
    aba = xl.sheet_names[0]
    df = pd.read_excel(caminho, sheet_name=aba)
    print(f"   Aba: '{aba}' | {len(df)} linhas | {len(df.columns)} colunas")

    # Renomear colunas
    df.columns = [c.strip() for c in df.columns]
    rename = {k.strip(): v for k, v in COLMAP.items()}
    df = df.rename(columns=rename)

    # Normalizar unidades
    if 'unidade' in df.columns:
        df['unidade'] = df['unidade'].replace(UNIDADE_MAP)

    # Colunas que existem tanto no xlsx quanto queremos inserir
    colunas_insert = [c for c in ['unidade','resposta','pergunta1','pergunta2',
                                   'pergunta3','pergunta4','pergunta5',
                                   'createdat','updatedat'] if c in df.columns]

    with conn.cursor() as cur:
        if truncar_primeiro:
            cur.execute("TRUNCATE TABLE public.pesquisa RESTART IDENTITY;")
            print("   ⚠️  Tabela truncada.")

        inseridos = 0
        ignorados = 0

        for _, row in df.iterrows():
            vals = {col: limpar_valor(row.get(col)) for col in colunas_insert}

            # Verificar duplicidade por ID original se disponível
            id_orig = limpar_valor(row.get('id'))
            if id_orig:
                cur.execute(
                    "SELECT 1 FROM public.pesquisa WHERE id = %s", (id_orig,)
                )
                if cur.fetchone():
                    ignorados += 1
                    continue

            cols   = list(vals.keys())
            placeh = ["%s"] * len(cols)
            sql    = f"INSERT INTO public.pesquisa ({', '.join(cols)}) VALUES ({', '.join(placeh)})"
            cur.execute(sql, list(vals.values()))
            inseridos += 1

        conn.commit()
        print(f"   ✅ Inseridos: {inseridos} | Ignorados (duplicados): {ignorados}")

def main():
    parser = argparse.ArgumentParser(description="Importa arquivos xlsx para o PostgreSQL")
    parser.add_argument("--pasta",   default=".",     help="Pasta com os arquivos xlsx")
    parser.add_argument("--arquivo", default=None,    help="Arquivo específico para importar")
    parser.add_argument("--truncar", action="store_true", help="Apaga todos os dados antes de importar")
    args = parser.parse_args()

    print("🐘 Conectando ao PostgreSQL...")
    conn = get_conn()
    print(f"   Conectado: {os.getenv('DB_HOST')}:{os.getenv('DB_PORT')} / {os.getenv('DB_NAME')}")

    garantir_tabela(conn)

    if args.arquivo:
        arquivos = [Path(args.arquivo)]
    else:
        arquivos = sorted(Path(args.pasta).glob("*.xlsx"))

    if not arquivos:
        print("❌ Nenhum arquivo .xlsx encontrado.")
        sys.exit(1)

    print(f"\n📋 {len(arquivos)} arquivo(s) encontrado(s):")
    for a in arquivos:
        print(f"   • {a.name}")

    for i, arq in enumerate(arquivos):
        importar_arquivo(conn, arq, truncar_primeiro=(args.truncar and i == 0))

    conn.close()
    print("\n🎉 Importação concluída!")

if __name__ == "__main__":
    main()
