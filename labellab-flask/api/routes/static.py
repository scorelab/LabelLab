import os
from flask import Blueprint, render_template, send_from_directory

from api.config import config

staticprint = Blueprint("static", __name__)

def static_route(filename, folder):
    if filename != "" and os.path.exists(config['development'].UPLOAD_FOLDER + '/' + str(folder) + '/' + filename):
        return send_from_directory(config['development'].UPLOAD_FOLDER + '/' + str(folder), filename)
    else:
        return render_template('index.html')
        
staticprint.add_url_rule(
    "/<int:folder>/<path:filename>", 
    view_func=static_route, 
    methods=["GET"]
)
