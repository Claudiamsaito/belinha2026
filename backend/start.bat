@echo off
echo ============================================
echo  Missao Saude Ilhabela - Backend Python
echo ============================================

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado. Instale Python 3.11+
    pause
    exit /b 1
)

REM Criar ambiente virtual se não existir
if not exist "venv" (
    echo Criando ambiente virtual...
    python -m venv venv
)

REM Ativar ambiente virtual
call venv\Scripts\activate

REM Instalar dependências
echo Instalando dependencias...
pip install -r requirements.txt --quiet

REM Iniciar servidor
echo.
echo Iniciando servidor Flask em http://localhost:5000
echo Pressione Ctrl+C para parar
echo.
python app.py
