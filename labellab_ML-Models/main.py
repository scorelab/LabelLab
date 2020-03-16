import os

from dotenv import load_dotenv
from flask import Flask, abort, request, jsonify
from models.mobilenet import mobilenet

app = Flask(__name__)

# Load environment variables from .env files
project_folder = os.path.expanduser(os.path.dirname(__file__))
load_dotenv(os.path.join(project_folder, '.env'))


@app.route("/", methods=['POST'])
def detect():
    image = request.files['image']
    model_name = request.args['model_name']
    filename = request.args['filename']
    results = None
    if model_name == "mobilenet":
        results = mobilenet(image, filename)
    else:
        abort(404)
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=os.getenv("DEBUG"), host=os.getenv("ML_HOST"), port=os.getenv("ML_PORT"))
