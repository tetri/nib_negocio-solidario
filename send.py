import subprocess

cp = subprocess.run('git add .', check=True, shell=True)
cp = subprocess.run('git commit -m "atualização de dados"', check=True, shell=True)
cp = subprocess.run('git push -u origin master -f', check=True, shell=True)