"""
Script de Sincronização Agendada — Opção C
Roda periodicamente (cron ou loop), detecta registros novos/alterados
no PostgreSQL e gera um JSON atualizado que o dashboard consome.

Uso:
    # Rodar uma vez:
    python sincronizar.py

    # Rodar em loop contínuo (a cada 5 minutos):
    python sincronizar.py --loop --intervalo 300

    # Adicionar ao cron (a cada 10 min):
    # */10 * * * * /usr/bin/python3 /caminho/para/sincronizar.py >> /var/log/sync_dashboard.log 2>&1

Instalar:
    pip install psycopg2-binary python-dotenv
"""

import os
import json
import time
import argparse
import psycopg2
import psycopg2.extras
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ─── Onde salvar o JSON gerado ───
OUTPUT_PATH = Path(os.getenv("OUTPUT_PATH", "./dashboard_data.json"))

def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        options="-c client_encoding=UTF8"
    )

def buscar_dados():
    conn = get_conn()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute("""
        SELECT
            id::text,
            unidade,
            profissional,
            especialidade,
            pergunta1  AS "P01",
            pergunta2  AS "P02",
            pergunta3  AS "P03",
            pergunta4  AS "P04",
            pergunta5  AS "P05",
            analisedesentimentos,
            TO_CHAR(createdat, 'YYYY-MM-DD') AS createdat
        FROM public.pesquisa
        WHERE pergunta1 IS NOT NULL
        ORDER BY createdat ASC
    """)

    rows = [dict(r) for r in cur.fetchall()]
    cur.close()
    conn.close()
    return rows

def calcular_word_freq(dados):
    import re
    from collections import Counter

    stopwords = {
        'o','a','e','de','do','da','dos','das','com','em','que','para','por',
        'um','uma','muito','os','as','se','ao','na','no','são','foi','mais',
        'mas','me','ou','também','pelo','pela','meu','sua','seu','não','é',
        'ser','isso','ter','bem','todo','todos','boa','bom','minha','nos',
        'ele','ela','eles','elas','eu','já','só','quando','como','há','nan',
        'tive','fui','sempre','tenho','esse','essa','este','esta','meu','seus'
    }

    words = []
    for d in dados:
        texto = d.get('P05') or ''
        if texto and texto != 'nan':
            for w in re.findall(r'\b[a-záéíóúâêîôûãõç]{4,}\b', texto.lower()):
                if w not in stopwords:
                    words.append(w)

    return Counter(words).most_common(30)

def gerar_json(dados):
    word_freq = calcular_word_freq(dados)

    datas = sorted(set(d['createdat'] for d in dados if d.get('createdat')))
    periodo = {
        "inicio": datas[0] if datas else None,
        "fim":    datas[-1] if datas else None,
    }

    output = {
        "gerado_em": datetime.now().isoformat(),
        "total":     len(dados),
        "periodo":   periodo,
        "word_freq": word_freq,
        "data":      dados
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, separators=(',', ':'))

    tamanho = OUTPUT_PATH.stat().st_size / 1024
    print(f"✅ [{datetime.now().strftime('%H:%M:%S')}] JSON gerado: {OUTPUT_PATH} "
          f"({len(dados)} registros · {tamanho:.1f} KB)")

def sincronizar():
    print(f"🔄 [{datetime.now().strftime('%H:%M:%S')}] Sincronizando...")
    try:
        dados = buscar_dados()
        gerar_json(dados)
    except Exception as e:
        print(f"❌ Erro na sincronização: {e}")
        raise

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--loop",      action="store_true", help="Rodar continuamente")
    parser.add_argument("--intervalo", type=int, default=300, help="Segundos entre execuções (padrão: 300)")
    args = parser.parse_args()

    if args.loop:
        print(f"🔁 Modo loop ativo — sincronizando a cada {args.intervalo}s")
        while True:
            sincronizar()
            time.sleep(args.intervalo)
    else:
        sincronizar()

if __name__ == "__main__":
    main()
