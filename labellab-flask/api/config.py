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
    LABELS_ALLOWED = ["bbox","polygon"]
    TEAMS_ALLOWED = ["labels","images","image labelling","models"]
    CATEGORIES_ALLOWED = ["general","labels","images","image labelling","models","misc"]
    ENTITY_TYPES_ALLOWED = ["label","image", "model"]
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
    """
    Testing config applies for both local testing and travis configurations
    """
    TESTING = True
    WTF_CSRF_ENABLED = False
    TEST_DATABASE =  os.environ.get(
        "TEST_DATABASE_URL"
    )
    if os.getenv("FLASK_CONFIG")=="travis":
        pass
    else:
        from sqlalchemy_utils.functions import database_exists, create_database
        if not database_exists(TEST_DATABASE):
            create_database(TEST_DATABASE)
        SQLALCHEMY_DATABASE_URI = TEST_DATABASE
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # needs to be removed in further versions
    UPLOAD_FOLDER = imagesdir


class ProductionConfig(Config):
    """Production Congigurations"""
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    )

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)

class DockerConfig(Config):
    """Docker config"""
    @classmethod
    def init_app(cls, app):
        ProductionConfig.init_app(app)

        # log to stderr
        import logging
        from logging import StreamHandler

        file_handler = StreamHandler()
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

class TravisConfig(Config):
    """
    Configs for travis
    """
    TESTING = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # needs to be removed in further versions
    UPLOAD_FOLDER = imagesdir
    ML_FILES_DIR = os.path.join(os.path.dirname(basedir),'ml_files')
    LABELS_ALLOWED = ["bbox","polygon"]
    TEAMS_ALLOWED = ["labels","images","image labelling","models"]

config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "docker": DockerConfig,
    "default": DevelopmentConfig,
    "travis": TravisConfig
}
