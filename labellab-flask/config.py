import os

basedir = os.path.abspath(os.path.dirname(__file__))

"""Constants used throughout the application.
    All hard coded settings/data that are not actual/official configuration
    options for Flask and their extensions goes here.
"""


class Config:
    """Default Flask configuration inherited by all environments. Use this for
    development environments.
    """

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    """Development Congigurations"""

    DEBUG = True
    # needs to be removed in further versions


class TestingConfig(Config):
    TESTING = True


class ProductionConfig(Config):
    """Production Congigurations"""

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)


config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
