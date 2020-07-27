import os
import sqlite3
import pandas as pd

if (not os.path.isfile('data.db')):
    #data_url = 'https://docs.google.com/spreadsheets/d/1if5WstOy_zJTdLdR2rlfxuuVSsQEh0EZVQtSylsSmwY/export?format=csv'
    data_url = '_data/negocio-solidario.csv'

    headers = ['data', 'categoria', 'nome', 'produtos',
               'local', 'telefone', 'entrega', 'link', 'ciente']

    data_table = pd.read_csv(data_url, header=None, names=headers)

    with sqlite3.connect('data.db') as conn:
        data_table.to_sql('data_table', conn, dtype={
            'data': 'date',
            'categoria': 'text',
            'nome': 'text',
            'produtos': 'text',
            'local': 'text',
            'telefone': 'text',
            'entrega': 'text',
            'link': 'text',
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
