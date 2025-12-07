from flask import Flask, render_template, request, redirect, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)
app.secret_key = "ASIDUNA#@#@D"  


def init_db():
    conn = sqlite3.connect("users.db")
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()


def get_user(username):
    conn = sqlite3.connect("users.db")
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cur.fetchone()
    conn.close()
    return user


@app.route("/")
def home():
    return redirect("/register")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = generate_password_hash(request.form["password"])
        password_rep = request.form["password_rep"]
        conn = sqlite3.connect("users.db")
        cur = conn.cursor()

        cur.execute("SELECT * FROM users WHERE username = ?", (username,))
        if cur.fetchone():
            conn.close()
            return  """
                        <script>
                            alert("Username or password has already been used. Try again!!!.");
                            window.location.href = "/register";
                        </script>

                    """ 
        elif password_rep == request.form["password"]:
            cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
            conn.close()
            return redirect("/login")
        

    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        user = get_user(username)

        if user and check_password_hash(user[2], password):
            session["user"] = username
            session["pass"] = password
            return redirect("/dashboard")
        else:
            return  """
                        <script>
                            alert("Invalid username or password. Try again!!!.");
                            window.location.href = "/login";
                        </script>

                    """  

    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect("/login")
    return render_template("home.html", username=session["user"])

@app.route("/courses")
def courses():
    if "user" not in session:
        return redirect("/login")
    return render_template("course.html", username=session["user"])

@app.route("/profile")
def profile():
    if "user" not in session:
        return redirect("/login")
    return render_template("profile.html",username=session["user"],password=session["pass"])

@app.route("/logout")
def logout():   
    session.clear()
    return redirect("/login")

if __name__ == "__main__":
    app.run(debug=True)
