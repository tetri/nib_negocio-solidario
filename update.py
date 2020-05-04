import csv
import urllib.request
import subprocess as cmd

url = 'https://docs.google.com/spreadsheets/d/1if5WstOy_zJTdLdR2rlfxuuVSsQEh0EZVQtSylsSmwY/export?format=csv'

local_filename, headers = urllib.request.urlretrieve(url)
cr = csv.reader(open(local_filename, encoding ='utf-8', newline=''))

categorias = ['Serviços de Saúde','Sem categoria','Serviços Jurídicos','Serviços de Saúde','Beleza e Estética','Sem categoria','Construção Civil','Moda e Confecção','Casa e Decoração','Casa e Decoração','Moda e Confecção','Artesanato','Construção Civil','Serviços de Saúde','Moda e Confecção','Serviços e Manutenção','Seguros','Alimentação','Serviços e Manutenção','Sem categoria','Serviços de Saúde','Sem categoria','Sem categoria','Serviços Automotivos','Beleza e Estética','Serviços Automotivos','Alimentação','Sem categoria','Alimentação','Sem categoria','Moda e Confecção','Serviços e Manutenção','Moda e Confecção','Sem categoria','Sem categoria','Serviços Automotivos','Artesanato','Beleza e Estética','Serviços e Manutenção','Serviços e Manutenção','Moda e Confecção','Alimentação','Sem categoria','Serviços e Manutenção','Sem categoria','Sem categoria','Beleza e Estética','Beleza e Estética','Artesanato','Sem categoria','Alimentação','Alimentação','Artesanato','Beleza e Estética','Sem categoria','Beleza e Estética','Beleza e Estética','Sem categoria','Alimentação','Sem categoria','Serviços de Saúde','Serviços de Saúde','Sem categoria','Beleza e Estética','Sem categoria','Alimentação','Moda e Confecção','Alimentação','Serviços Automotivos','Serviços Automotivos','Serviços Jurídicos','Seguros','Moda e Confecção','Moda e Confecção','Serviços Automotivos','Moda e Confecção','Sem categoria','Serviços de Saúde','Serviços Automotivos','Serviços Jurídicos','Seguros','Serviços e Manutenção','Serviços Automotivos','Moda e Confecção','Sem categoria','Serviços Automotivos','Artesanato','Serviços Automotivos','Artesanato','Serviços de Saúde','Serviços Automotivos','Serviços Automotivos','Moda e Confecção','Construção Civil','Serviços Automotivos','Sem categoria','Serviços e Manutenção','Alimentação','Sem categoria','Serviços Jurídicos','Sem categoria','Sem categoria','Serviços Jurídicos','Seguros','Moda e Confecção','Alimentação','Sem categoria','Moda e Confecção','Serviços Contábeis','Sem categoria','Sem categoria','Artesanato','Moda e Confecção','Serviços e Manutenção','Serviços de Saúde','Moda e Confecção','Artesanato','Serviços Automotivos','Sem categoria','Alimentação','Serviços Automotivos','Serviços e Manutenção','Sem categoria','Serviços e Manutenção','Beleza e Estética','Sem categoria','Serviços Automotivos','Sem categoria','Serviços e Manutenção','Sem categoria','Beleza e Estética','Sem categoria','Serviços e Manutenção','Sem categoria','Sem categoria','Alimentação','Beleza e Estética','Sem categoria','Serviços e Manutenção','Sem categoria','Moda e Confecção']

with open('_data/negocio-solidario.csv', mode='w', encoding='utf-8', newline='\n') as ns:
    w = csv.writer(ns)

    w.writerow(['data','linha','categoria','nome','produtos','local','telefone','entrega','link','ciente'])

    idx = 1
    # ao remover duplicados, cuidado com a classificação em categorias!
    duplicados = [0,1,2,39,41,52,64,70,101,132]
    for i, row in enumerate(cr):
        if (i in duplicados):
            continue
        
        row.insert(1, idx)
        if (idx <= len(categorias)):
            row.insert(2, categorias[idx-1])
        else:
            row.insert(2, 'Sem categoria')
        idx = idx + 1
        
        w.writerow(row)

cp = cmd.run('git add .', check=True, shell=True)
cp = cmd.run('git commit -m "atualização de dados"', check=True, shell=True)
cp = cmd.run('git push -u origin master -f', check=True, shell=True)