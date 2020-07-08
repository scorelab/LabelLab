import os

basedir = os.path.abspath(os.path.dirname(__file__))

imagesdir = os.path.join(os.path.dirname(basedir),'uploads')

"""Constants used throughout the application.
    All hard coded settings/data that are not actual/official configuration
    options for Flask and their extensions goes here.
"""


class Config:
    """Default Flask configuration inherited by all environments. Use this for
    development environments.
    """
    SECRET_KEY = os.environ.get("SECRET_KEY") or "big secret"
    JWT_SECRET_KEY = os.environ.get("SECRET_KEY") or "very big secret"
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]
    LABELS_ALLOWED = ["rectangle","polygon"]
    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    """Development Congigurations"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DEV_DATABASE_URL"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # needs to be removed in further versions
    ML_FILES_DIR = os.path.join(os.path.dirname(basedir),'ml_files')
    UPLOAD_FOLDER = imagesdir
    

class TestingConfig(Config):
    TESTING = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "TEST_DATABASE_URL"
    )


class ProductionConfig(Config):
    """Production Congigurations"""
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    )

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)


config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
