import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from flask import Flask, jsonify
from flask_cors import CORS
import database as db_module
from routes.avaliacoes import avaliacoes_bp
from routes.auth import auth_bp
from routes.admin import admin_bp

app = Flask(__name__)

# CORS: permite requisições do Expo (8081) e web
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Registrar blueprints
app.register_blueprint(avaliacoes_bp, url_prefix="/api/avaliacoes")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(admin_bp, url_prefix="/api/admin")


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "app": "Missão Saúde Ilhabela"})


@app.errorhandler(404)
def not_found(e):
    return jsonify({"erro": "Rota não encontrada"}), 404


@app.errorhandler(500)
def internal_error(e):
    return jsonify({"erro": "Erro interno do servidor"}), 500


if __name__ == "__main__":
    db_module.init_db()
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    print(f"Missão Saúde Backend rodando em http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
