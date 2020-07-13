# This Python file uses the following encoding: utf-8

import csv
import urllib.request
import os

from datetime import datetime
from slugify import slugify

url = 'https://docs.google.com/spreadsheets/d/1if5WstOy_zJTdLdR2rlfxuuVSsQEh0EZVQtSylsSmwY/export?format=csv'

local_filename, headers = urllib.request.urlretrieve(url)
cr = csv.reader(open(local_filename, encoding ='utf-8', newline=''))

categorias = ['Serviços de Saúde','Serviços e Manutenção','Serviços Jurídicos','Serviços de Saúde','Beleza e Estética','Artesanato','Construção Civil','Moda e Confecção','Casa e Decoração','Casa e Decoração','Moda e Confecção','Artesanato','Construção Civil','Serviços de Saúde','Calçados','Serviços e Manutenção','Seguros','Alimentação','Serviços e Manutenção','Comunicação Visual','Serviços de Saúde','Fotografia','Educação','Serviços Automotivos','Beleza e Estética','Serviços Automotivos','Alimentação','Artesanato','Alimentação','Organização','Moda e Confecção','Serviços e Manutenção','Moda e Confecção','Educação','Segurança','Serviços Automotivos','Artesanato','Beleza e Estética','Serviços e Manutenção','Serviços e Manutenção','Moda e Confecção','Alimentação','Consultoria','Serviços e Manutenção','Comunicação Visual','Organização','Beleza e Estética','Beleza e Estética','Artesanato','Produtos Esportivos','Alimentação','Alimentação','Artesanato','Beleza e Estética','Serviços Automotivos','Beleza e Estética','Beleza e Estética','Beleza e Estética','Alimentação','Calçados','Serviços de Saúde','Serviços de Saúde','Serviços Automotivos','Beleza e Estética','Vendas Online','Alimentação','Moda e Confecção','Alimentação','Serviços Automotivos','Serviços Jurídicos','Seguros','Moda e Confecção','Moda e Confecção','Serviços Automotivos','Moda e Confecção','Beleza e Estética','Serviços de Saúde','Serviços Automotivos','Serviços Jurídicos','Seguros','Serviços e Manutenção','Serviços Automotivos','Moda e Confecção','Imóveis','Serviços Automotivos','Artesanato','Serviços Automotivos','Artesanato','Serviços de Saúde','Serviços Automotivos','Serviços Automotivos','Moda e Confecção','Construção Civil','Serviços Automotivos','Sem categoria','Serviços e Manutenção','Alimentação','Educação','Serviços Jurídicos','Consórcios','Comunicação Visual','Serviços Jurídicos','Seguros','Moda e Confecção','Alimentação','Consultoria','Moda e Confecção','Serviços Contábeis','Casa e Decoração','Serviços e Manutenção','Artesanato','Moda e Confecção','Serviços e Manutenção','Serviços de Saúde','Moda e Confecção','Artesanato','Serviços Automotivos','Serviços Automotivos','Alimentação','Serviços Automotivos','Serviços e Manutenção','Artesanato','Serviços e Manutenção','Beleza e Estética','Casa e Decoração','Serviços Automotivos','Comunicação Visual','Vendas Online','Beleza e Estética','Comunicação Visual','Serviços e Manutenção','Comunicação Visual','Pet','Alimentação','Beleza e Estética','Comunicação Visual','Serviços e Manutenção','Artesanato','Moda e Confecção','Artesanato','Moda e Confecção','Beleza e Estética','Serviços Jurídicos','Sem categoria','Alimentação','Serviços e Manutenção','Serviços e Manutenção','Alimentação','Serviços e Manutenção','Serviços e Manutenção','Organização','Beleza e Estética','Beleza e Estética','Alimentação','Beleza e Estética','Serviços e Manutenção']

list( map( os.unlink, (os.path.join( '_posts',f) for f in os.listdir('_posts')) ) )

with open('_data/negocio-solidario.csv', mode='w', encoding='utf-8', newline='\n') as ns:
    w = csv.writer(ns)

    w.writerow(['data','categoria','nome','produtos','local','telefone','entrega','link','ciente'])

    idx = 1
    # ao remover duplicados ou excluídos, cuidado com a classificação em categorias!
    duplicados = [0,1,2,39,41,52,64,70,77,101,132,138,152,161,162,168,169]
    excluidos = [156]

    for i, row in enumerate(cr):
        if (i in duplicados):
            continue

        if (i in excluidos):
            continue
        
        if (idx <= len(categorias)):
            row.insert(1, categorias[idx-1])
        else:
            row.insert(1, 'Sem categoria')
        idx = idx + 1
        
        w.writerow(row)

        data = datetime.strptime(row[0],'%d/%m/%Y %H:%M:%S')
        _data = data.strftime('%Y-%m-%d')
        #print(data)

        slug = slugify(row[2])
        #print (slug)

        post_title = row[2] #.replace('\'','\\\'')
        post_date = data.strftime('%Y-%m-%d %H:%M:%S %z')
        post_categories = row[1]

        #print(f'_posts/{data}_{slug}.md')

        with open(f'_posts/{_data}-{slug}.md', mode='w', encoding='utf-8', newline='\n') as post:
            post.write('---\r\n')
            post.write('layout: post\r\n')
            post.write(f'title: {post_title}\r\n')
            post.write(f'date: {post_date}\r\n')
            post.write(f'categories: {post_categories}\r\n')
            post.write('---\r\n')
            post.write('\r\n')
            post.write(f'# {row[2]}\r\n')
            post.write('\r\n')
            post.write(f'{row[3]}\r\n')

