import os

from flask import Flask
from flask_mongoalchemy import MongoAlchemy

app = Flask(__name__)

app.config["MONGOALCHEMY_DATABASE"] = os.getenv("DB_Name") if os.getenv("DB_Name") else "labellab"
app.config["MONGOALCHEMY_CONNECTION_STRING"] = os.getenv("MONGO_URI") if os.getenv(
    "DB_Name") else "mongodb://localhost:27017/labellab"
db = MongoAlchemy(app)
