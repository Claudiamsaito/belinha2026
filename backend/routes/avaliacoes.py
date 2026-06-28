from flask import Blueprint, request, jsonify
from routes.auth import requer_auth
import database as db_module

avaliacoes_bp = Blueprint("avaliacoes", __name__)


@avaliacoes_bp.route("", methods=["GET"])
@requer_auth
def listar_todas():
    periodo = request.args.get("periodo")
    dias = _periodo_para_dias(periodo)
    avaliacoes = db_module.obter_todas_avaliacoes(dias)
    return jsonify(avaliacoes)


@avaliacoes_bp.route("", methods=["POST"])
def salvar():
    data = request.get_json()
    if not data or not data.get("unidade_id"):
        return jsonify({"erro": "unidade_id é obrigatório"}), 400

    payload = {
        "unidade_id": data["unidade_id"],
        "atendimento_recepcao": int(data.get("atendimento_recepcao", 0)),
        "tempo_espera_recepcao": int(data.get("tempo_espera_recepcao", 0)),
        "tempo_espera_consulta": int(data.get("tempo_espera_consulta", 0)),
        "infraestrutura": int(data.get("infraestrutura", 0)),
        "elogio_retorno": data.get("elogio_retorno", "naoFez"),
        "comentario": data.get("comentario", ""),
        "ip_address": request.remote_addr,
        "user_agent": request.headers.get("User-Agent", ""),
    }

    avaliacao = db_module.salvar_avaliacao(payload)
    return jsonify(avaliacao), 201


@avaliacoes_bp.route("/unidade/<unidade_id>", methods=["GET"])
def por_unidade(unidade_id: str):
    avaliacoes = db_module.obter_avaliacoes_unidade(unidade_id)
    return jsonify(avaliacoes)


@avaliacoes_bp.route("/stats/<unidade_id>", methods=["GET"])
def stats_unidade(unidade_id: str):
    periodo = request.args.get("periodo")
    dias = _periodo_para_dias(periodo)
    stats = db_module.obter_stats_unidade(unidade_id, dias)
    return jsonify(stats)


@avaliacoes_bp.route("/stats", methods=["GET"])
def stats_todas():
    periodo = request.args.get("periodo")
    dias = _periodo_para_dias(periodo)
    stats = db_module.obter_todas_stats(dias)
    return jsonify(stats)


def _periodo_para_dias(periodo: str | None) -> int | None:
    mapa = {"7dias": 7, "30dias": 30, "3meses": 90}
    return mapa.get(periodo) if periodo else None
