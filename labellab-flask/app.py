import os
from dotenv import load_dotenv
from flask import render_template

import sys
sys.path.insert(0,os.getcwd())
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")

if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
    
from api.main import create_app

app = create_app(os.getenv("FLASK_CONFIG") or "default")

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def default_route(path):
    return render_template('index.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
