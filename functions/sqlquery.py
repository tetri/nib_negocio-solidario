import os
import sqlite3
import pandas as pd

if (not os.path.isfile('data.db')):
    #data_url = 'https://docs.google.com/spreadsheets/d/1if5WstOy_zJTdLdR2rlfxuuVSsQEh0EZVQtSylsSmwY/export?format=csv'
    data_url = '_data/negocio-solidario.csv'

    headers = ['data', 'categoria', 'nome', 'produtos',
               'local', 'telefone', 'entrega', 'link', 'ciente']

    nib = pd.read_csv(data_url, header=None, names=headers)

    with sqlite3.connect('negocio-solidario.db') as conn:
        nib.to_sql('nib', conn, dtype={
            'id': 'integer',
            'data': 'date',
            'categoria': 'text',
            'nome': 'text',
            'produtos': 'text',
            'local': 'text',
            'telefone': 'text',
            'telefone2': 'text',
            'telefone3': 'text',
            'telefone4': 'text',
            'entrega': 'text',
            'link': 'text',
            'link2': 'text',
            'link3': 'text',
            'link4': 'text',
            'ciente': 'text'
        })

def sql_query(query):
    with sqlite3.connect('data.db') as conn:
        cur = conn.cursor()
        cur.execute(query)
        rows = cur.fetchall()
        return rows


def sql_edit(query, var):
    with sqlite3.connect('data.db') as conn:
        cur = conn.cursor()
        cur.execute(query, var)
        conn.commit()


def sql_delete(query, var):
    with sqlite3.connect('data.db') as conn:
        cur = conn.cursor()
        cur.execute(query, var)
        conn.commit()
