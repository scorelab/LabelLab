import os

from app import app
from dotenv import load_dotenv
from routers.auth.routes import authBlueprint
from routers.classification.routes import classificationBlueprint

# Load environment variables from .env files
project_folder = os.path.expanduser(os.path.dirname(__file__))
load_dotenv(os.path.join(project_folder, '.env'))

app.register_blueprint(authBlueprint, url_prefix='/auth')
app.register_blueprint(classificationBlueprint, url_prefix='/classify')


@app.route("/", methods=['GET', 'POST'])
def welcome():
    return "Welcome to the flask app. This is a sample route. Other routes are in router/ folder"


if __name__ == '__main__':
    app.run(debug=os.getenv("DEBUG"), host=os.getenv("HOST"), port=os.getenv("PORT"))
