import os 
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow

from api.config import config
from api import commands
from api.routes import users, projects, mlclassifiers, images, labels, teams, analytics, static, ml_files
from api.extensions import db, migrate, jwt, ma
from api.models import User, Image, Label, LabelData, ProjectMembers, Projects, Team, RevokedToken, Point, MLClassifier

def create_app(config_name):
    try:
        app = Flask(
            __name__,
            static_folder=config[config_name].UPLOAD_FOLDER,
            static_url_path='',
            template_folder="../build"
        )
        app.config.from_object(config[config_name])
        config[config_name].init_app(app)

        register_additional_extensions(app)
        register_blueprint(app)
        register_commands(app)
        register_shellcontext(app)

        return app
    except Exception as err:
        print("Error occured:", err)


def register_additional_extensions(app):
    """Register additional Flask extensions"""
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)



def register_blueprint(app):
    """Register Flask blueprints."""
    app.register_blueprint(users.usersprint, url_prefix="/api/v1")
    app.register_blueprint(mlclassifiers.mlclassifiersprint, url_prefix="/api/v1")
    app.register_blueprint(labels.labelsprint, url_prefix="/api/v1")
    app.register_blueprint(projects.projectsprint, url_prefix="/api/v1")
    app.register_blueprint(teams.teamsprint, url_prefix="/api/v1")
    app.register_blueprint(images.imagesprint, url_prefix="/api/v1")
    app.register_blueprint(analytics.analyticsprint, url_prefix="/api/v1")
    app.register_blueprint(static.staticprint, url_prefix="/static/uploads")
    app.register_blueprint(ml_files.mlfilesprint, url_prefix="/ml_files")
    return None

def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.test)

def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {"db": db, "User": models.User}

    app.shell_context_processor(shell_context)
