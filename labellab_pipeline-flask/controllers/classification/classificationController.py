import os

import requests
from flask import jsonify, request


def classifyGet():
    return "Welcome to the flask backend for classification"


def classifyPost():
    # TODO: A model is needed for Label, Image, Project before this endpoint can be implemented fully
    # Assuming that the image to be classified has been sent along with the request
    url = os.getenv("ML_HOST") + ":" + os.getenv("ML_PORT")
    params = {
        'image': request.files['file'],  # Assuming the file passed has been named as param file
        'filename': request.args['filename']
    }
    result = requests.post(url, params)
    return jsonify(result)
