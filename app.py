from flask import Flask, jsonify, render_template, request, redirect, session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # replace with a strong secret key

def init_db():
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            title TEXT,
            content TEXT,
            category TEXT,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# ✅ Only this login function (remove the duplicate!)
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = sqlite3.connect('diary.db')
        c = conn.cursor()
        c.execute("SELECT id, password FROM users WHERE username=?", (username,))
        user = c.fetchone()
        conn.close()

        if user and check_password_hash(user[1], password):
            session['user_id'] = user[0]
            return redirect('/dashboard')
        
        return render_template('invalid.html')  # Styled invalid page

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = generate_password_hash(request.form['password'])
        conn = sqlite3.connect('diary.db')
        c = conn.cursor()
        try:
            c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
        except sqlite3.IntegrityError:
            return "Username already exists"
        return redirect('/')
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect('/')
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute("SELECT id, title, content, category, date FROM entries WHERE user_id=? ORDER BY date DESC", (session['user_id'],))
    entries = c.fetchall()
    return render_template('dashboard.html', entries=entries)

@app.route('/add', methods=['POST'])
def add_entry():
    if 'user_id' in session:
        title = request.form['title']
        content = request.form['content']
        category = request.form['category']
        conn = sqlite3.connect('diary.db')
        c = conn.cursor()
        c.execute("INSERT INTO entries (user_id, title, content, category) VALUES (?, ?, ?, ?)",
                  (session['user_id'], title, content, category))
        conn.commit()
        return redirect('/dashboard')
    return redirect('/')

@app.route('/search', methods=['GET'])
def search():
    if 'user_id' not in session:
        return redirect('/')
    keyword = request.args.get('q', '')
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute("SELECT title, content, category, date FROM entries WHERE user_id=? AND content LIKE ?",
              (session['user_id'], f'%{keyword}%'))
    results = c.fetchall()
    return render_template('search.html', results=results, keyword=keyword)

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/profile')
def profile():
    if 'user_id' not in session:
        return redirect('/')
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute("SELECT username FROM users WHERE id=?", (session['user_id'],))
    username = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM entries WHERE user_id=?", (session['user_id'],))
    entry_count = c.fetchone()[0]
    return render_template('profile.html', username=username, entry_count=entry_count)

@app.route('/export')
def export_entries():
    if 'user_id' not in session:
        return redirect('/')
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute("SELECT title, content, category, date FROM entries WHERE user_id=?", (session['user_id'],))
    entries = c.fetchall()

    export_data = ""
    for entry in entries:
        export_data += f"Title: {entry[0]}\nDate: {entry[3]}\nCategory: {entry[2]}\nContent:\n{entry[1]}\n\n{'-'*40}\n"

    return (
        export_data,
        200,
        {
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename="diary_export.txt"'
        }
    )

@app.route('/data')
def data():
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute("SELECT title, date FROM entries WHERE user_id=?", (session['user_id'],))
    rows = c.fetchall()
    conn.close()
    return jsonify([{"title": r[0], "start": r[1][:10]} for r in rows])

@app.route('/edit', methods=['POST'])
def edit_entry():
    if 'user_id' in session:
        entry_id = request.form['id']
        title = request.form['title']
        content = request.form['content']
        category = request.form['category']
        conn = sqlite3.connect('diary.db')
        c = conn.cursor()
        c.execute("UPDATE entries SET title=?, content=?, category=? WHERE id=? AND user_id=?",
                  (title, content, category, entry_id, session['user_id']))
        conn.commit()
        return redirect('/dashboard')
    return redirect('/')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
