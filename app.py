from flask import Flask, request, redirect, render_template

app = Flask(__name__)


@app.route('/')
def sql_database():
    from functions.sqlquery import sql_query

    results = sql_query("SELECT * FROM nib order by data desc LIMIT 10")
    #print(results)

    return render_template('sqldatabase.html', results=results)


@app.route('/delete', methods=['GET'])
def sql_datadelete():
    from functions.sqlquery import sql_delete, sql_query

    if request.method == 'GET':
        nome = request.args.get('nome')
        local = request.args.get('local')

        sql_delete("DELETE FROM nib where nome = ? and local = ?", (nome, local))

    #results = sql_query("SELECT * FROM nib")

    #return render_template('sqldatabase.html', results=results)
    return sql_database()


@app.route('/query_edit', methods=['GET'])
def sql_editlink():
    from functions.sqlquery import sql_query

    if request.method == 'GET':
        nome = request.args.get('nome')
        local = request.args.get('local')

        eresults = sql_query("SELECT * FROM nib where nome = ? and local = ?", (nome, local))
    
    #results = sql_query("SELECT * FROM nib")

    #return render_template('sqldatabase.html', eresults=eresults, results=results)
    return sql_database()


@app.route('/edit', methods=['POST'])
def sql_dataedit():
    from functions.sqlquery import sql_edit, sql_query

    if request.method == 'POST':
        old_last_name = request.form['old_last_name']
        old_first_name = request.form['old_first_name']
        last_name = request.form['last_name']
        first_name = request.form['first_name']
        address = request.form['address']
        city = request.form['city']
        state = request.form['state']
        zip = request.form['zip']

        sql_edit("UPDATE nib set first_name=?,last_name=?,address=?,city=?,state=?,zip=? WHERE first_name=? and last_name=?",
                        (first_name, last_name, address, city, state, zip, old_first_name, old_last_name))

    #results = sql_query("SELECT * FROM nib")

    #return render_template('sqldatabase.html', results=results)
    return sql_database()


if __name__ == "__main__":
    app.run(debug=True)
