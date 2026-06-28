import os
import jwt
import requests
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, redirect
import database as db_module

auth_bp = Blueprint("auth", __name__)

JWT_SECRET = os.environ.get("JWT_SECRET", "missao-saude-secret-key-2024")
JWT_EXPIRY_HOURS = int(os.environ.get("JWT_EXPIRY_HOURS", "24"))

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "http://localhost:5000/api/auth/google/callback")

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:8081")


def criar_token(admin: dict) -> str:
    payload = {
        "sub": str(admin["id"]),
        "email": admin["email"],
        "nome": admin.get("nome") or admin["email"],
        "role": admin.get("role", "admin"),
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def verificar_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def requer_auth(f):
    from functools import wraps

    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"erro": "Token não fornecido"}), 401
        token = auth_header[7:]
        payload = verificar_token(token)
        if not payload:
            return jsonify({"erro": "Token inválido ou expirado"}), 401
        request.admin = payload
        return f(*args, **kwargs)

    return decorated


# ─── Login com usuário/senha ──────────────────────────────────────────────────

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"erro": "Dados inválidos"}), 400

    email = data.get("email", "").strip().lower()
    senha = data.get("senha", "").strip()

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    admin = db_module.autenticar_admin(email, senha)
    if not admin:
        db_module.registrar_auditoria(
            email, "LOGIN_FALHA", "Credenciais incorretas", request.remote_addr
        )
        return jsonify({"erro": "Email ou senha incorretos"}), 401

    token = criar_token(admin)
    db_module.registrar_auditoria(
        email, "LOGIN", "Login via email/senha", request.remote_addr
    )

    return jsonify({
        "token": token,
        "admin": {
            "id": admin["id"],
            "email": admin["email"],
            "nome": admin.get("nome") or admin["email"],
            "role": admin.get("role", "admin"),
        },
    })


# ─── Google OAuth ─────────────────────────────────────────────────────────────

@auth_bp.route("/google/url", methods=["GET"])
def google_auth_url():
    if not GOOGLE_CLIENT_ID:
        return jsonify({"erro": "Google OAuth não configurado"}), 503

    redirect_after = request.args.get("redirect", FRONTEND_URL)

    url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        "&response_type=code"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
        f"&state={redirect_after}"
    )
    return jsonify({"url": url})


@auth_bp.route("/google/callback", methods=["GET"])
def google_callback():
    code = request.args.get("code")
    state = request.args.get("state", FRONTEND_URL)

    if not code:
        return redirect(f"{state}?erro=oauth_cancelado")

    # Trocar código por token
    token_resp = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        },
        timeout=10,
    )

    if not token_resp.ok:
        return redirect(f"{state}?erro=oauth_token_falhou")

    tokens = token_resp.json()
    access_token = tokens.get("access_token")

    # Obter informações do usuário Google
    user_resp = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )

    if not user_resp.ok:
        return redirect(f"{state}?erro=oauth_userinfo_falhou")

    user_info = user_resp.json()
    google_id = user_info.get("id")
    email = user_info.get("email", "").lower()
    nome = user_info.get("name", email)

    admin = db_module.obter_ou_criar_admin_google(google_id, email, nome)
    if not admin:
        return redirect(f"{state}?erro=email_nao_autorizado")

    token = criar_token(admin)
    db_module.registrar_auditoria(
        email, "LOGIN", "Login via Google OAuth", request.remote_addr
    )

    # Redirecionar para o frontend com o token
    return redirect(f"{state}?token={token}&nome={nome}")


@auth_bp.route("/google/verify", methods=["POST"])
def google_verify_token():
    """Verifica um ID token do Google (para fluxo mobile com expo-auth-session)."""
    data = request.get_json()
    id_token = data.get("id_token") if data else None

    if not id_token:
        return jsonify({"erro": "ID token não fornecido"}), 400

    # Verificar token com Google
    verify_resp = requests.get(
        f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}",
        timeout=10,
    )

    if not verify_resp.ok:
        return jsonify({"erro": "Token Google inválido"}), 401

    info = verify_resp.json()

    if GOOGLE_CLIENT_ID and info.get("aud") != GOOGLE_CLIENT_ID:
        return jsonify({"erro": "Token não pertence a este app"}), 401

    google_id = info.get("sub")
    email = info.get("email", "").lower()
    nome = info.get("name", email)

    admin = db_module.obter_ou_criar_admin_google(google_id, email, nome)
    if not admin:
        return jsonify({"erro": "Email não autorizado para acesso admin"}), 403

    token = criar_token(admin)
    db_module.registrar_auditoria(
        email, "LOGIN", "Login via Google (mobile)", request.remote_addr
    )

    return jsonify({
        "token": token,
        "admin": {
            "id": admin["id"],
            "email": admin["email"],
            "nome": admin.get("nome") or email,
            "role": admin.get("role", "admin"),
        },
    })


@auth_bp.route("/me", methods=["GET"])
@requer_auth
def me():
    return jsonify(request.admin)


@auth_bp.route("/logout", methods=["POST"])
@requer_auth
def logout():
    db_module.registrar_auditoria(
        request.admin.get("email", "?"), "LOGOUT", "", request.remote_addr
    )
    return jsonify({"ok": True})


@auth_bp.route("/alterar-senha", methods=["POST"])
@requer_auth
def alterar_senha():
    import hashlib
    data = request.get_json()
    senha_atual = data.get("senha_atual", "")
    nova_senha = data.get("nova_senha", "")

    if not senha_atual or not nova_senha:
        return jsonify({"erro": "Informe senha atual e nova senha"}), 400

    if len(nova_senha) < 8:
        return jsonify({"erro": "Nova senha deve ter ao menos 8 caracteres"}), 400

    email = request.admin["email"]
    admin = db_module.autenticar_admin(email, senha_atual)
    if not admin:
        return jsonify({"erro": "Senha atual incorreta"}), 401

    nova_hash = hashlib.sha256(nova_senha.encode()).hexdigest()
    with db_module.db() as conn:
        conn.execute(
            "UPDATE admin_users SET senha_hash = ? WHERE email = ?",
            (nova_hash, email),
        )

    db_module.registrar_auditoria(email, "ALTERAR_SENHA", "", request.remote_addr)
    return jsonify({"ok": True})
