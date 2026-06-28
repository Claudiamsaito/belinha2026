"""database.py - Gerenciador de banco de dados SQLite"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'belinha_game.db')

def init_db():
    """Inicializa o banco de dados com as tabelas necessárias"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Tabela de avaliações de recepção (QR Code)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS avaliacoes_recepcao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            unidade_id TEXT NOT NULL,
            unidade_nome TEXT NOT NULL,
            limpeza INTEGER,
            recepcao INTEGER,
            tempo_espera INTEGER,
            comentarios TEXT,
            nome_usuario TEXT,
            telefone TEXT,
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabela de avaliações médicas (WhatsApp)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS avaliacoes_medicas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            unidade_id TEXT NOT NULL,
            unidade_nome TEXT NOT NULL,
            medico_nome TEXT,
            atencao INTEGER,
            explicacao INTEGER,
            horario_cumprido INTEGER,
            comentarios TEXT,
            nome_usuario TEXT,
            telefone TEXT,
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabela de progresso do usuário
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS progresso_usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tela_atual TEXT,
            caminho_selecionado TEXT,
            unidade_selecionada TEXT,
            data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def salvar_avaliacao_recepcao(unidade_id, unidade_nome, limpeza, recepcao, tempo_espera, comentarios, nome_usuario=None, telefone=None):
    """Salva uma avaliação de recepção no banco de dados"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO avaliacoes_recepcao 
        (unidade_id, unidade_nome, limpeza, recepcao, tempo_espera, comentarios, nome_usuario, telefone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (unidade_id, unidade_nome, limpeza, recepcao, tempo_espera, comentarios, nome_usuario, telefone))
    
    conn.commit()
    conn.close()

def salvar_avaliacao_medica(unidade_id, unidade_nome, medico_nome, atencao, explicacao, horario_cumprido, comentarios, nome_usuario=None, telefone=None):
    """Salva uma avaliação médica no banco de dados"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO avaliacoes_medicas 
        (unidade_id, unidade_nome, medico_nome, atencao, explicacao, horario_cumprido, comentarios, nome_usuario, telefone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (unidade_id, unidade_nome, medico_nome, atencao, explicacao, horario_cumprido, comentarios, nome_usuario, telefone))
    
    conn.commit()
    conn.close()

def obter_todas_avaliacoes_recepcao():
    """Obtém todas as avaliações de recepção"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM avaliacoes_recepcao')
    avaliacoes = cursor.fetchall()
    
    conn.close()
    return avaliacoes

def obter_todas_avaliacoes_medicas():
    """Obtém todas as avaliações médicas"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM avaliacoes_medicas')
    avaliacoes = cursor.fetchall()
    
    conn.close()
    return avaliacoes

def obter_media_avaliacoes_unidade(unidade_id):
    """Obtém a média de avaliações para uma unidade"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT 
            AVG(limpeza) as media_limpeza,
            AVG(recepcao) as media_recepcao,
            AVG(tempo_espera) as media_tempo_espera,
            COUNT(*) as total_avaliacoes
        FROM avaliacoes_recepcao
        WHERE unidade_id = ?
    ''', (unidade_id,))
    
    resultado = cursor.fetchone()
    conn.close()
    
    return resultado

def salvar_progresso(tela_atual, caminho_selecionado=None, unidade_selecionada=None):
    """Salva o progresso do usuário"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Limpa o progresso anterior
    cursor.execute('DELETE FROM progresso_usuario')
    
    cursor.execute('''
        INSERT INTO progresso_usuario 
        (tela_atual, caminho_selecionado, unidade_selecionada)
        VALUES (?, ?, ?)
    ''', (tela_atual, caminho_selecionado, unidade_selecionada))
    
    conn.commit()
    conn.close()

def obter_progresso():
    """Obtém o progresso do usuário"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM progresso_usuario LIMIT 1')
    progresso = cursor.fetchone()
    
    conn.close()
    return progresso

# Inicializa o banco de dados quando o módulo é importado
if not os.path.exists(DB_PATH):
    init_db()
