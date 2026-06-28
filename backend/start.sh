#!/bin/bash
echo "============================================"
echo " Missao Saude Ilhabela - Backend Python"
echo "============================================"

# Criar venv se não existir
if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt --quiet

echo ""
echo "Iniciando servidor Flask em http://localhost:5000"
echo "Pressione Ctrl+C para parar"
echo ""
python app.py
