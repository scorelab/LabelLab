from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from config import config
from routes import users
from extensions import db, migrate
from models import User, Image, Label, LabelData, ProjectMembers, Projects, Team


def create_app(config_name):
    try:
        app = Flask(
            __name__, 
            static_folder="../build/static", 
            template_folder="../build"
        )
        app.config.from_object(config[config_name])
        config[config_name].init_app(app)
        
        register_additional_extensions(app)
        register_blueprint(app)
        register_shellcontext(app)

        return app
    except Exception as err:
        print("Error occured:", err)


def register_additional_extensions(app):
    """Register additional Flask extensions"""
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

def register_blueprint(app):
    """Register Flask blueprints."""
    app.register_blueprint(users.usersprint, url_prefix="/api/users")
    return None

def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {"db": db, "User": user.model.User}

    app.shell_context_processor(shell_context)