from flask import Flask
from routers.auth.routes import authBlueprint

app = Flask(__name__)

app.register_blueprint(authBlueprint, url_prefix='/auth')