from flask import Flask
from flask_cors import CORS

from config import config
from routes import users


def create_app(config_name):
    app = Flask(
        __name__, static_folder="../build/static", template_folder="../build"
    )
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    register_additional_extensions(app)
    register_blueprint(app)

    return app


def register_additional_extensions(app):
    """Register additional Flask extensions"""
    CORS(app)

def register_blueprint(app):
    """Register Flask blueprints."""
    app.register_blueprint(users.usersprint, url_prefix="/api/users")
    return None
