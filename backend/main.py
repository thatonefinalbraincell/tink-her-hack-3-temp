# server.py
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Route to serve the college input form (index.html)
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        college_name = request.form['collegeName']
        if college_name:
            # Redirect to verific.html and pass college name as a query parameter
            return redirect(url_for('verific', college_name=college_name))
        else:
            # If no college name is entered, stay on the form page
            return redirect(url_for('index'))
    return render_template('index.html')

# Route to handle the verification page (verific.html)
@app.route('/verific.html')
def verific():
    college_name = request.args.get('college_name')
    return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Page</title>
        </head>
        <body>
            <h1>College Verification</h1>
            <p>You entered the college name: {college_name}</p>
        </body>
        </html>
    """

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
