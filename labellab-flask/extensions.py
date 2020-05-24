from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.ext.declarative import declarative_base

# from .app import app

db = SQLAlchemy()
migrate = Migrate()
Base = declarative_base()