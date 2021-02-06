import os
from flask import Blueprint, render_template, send_from_directory

from api.config import config

mlfilesprint = Blueprint("ml_files", __name__)

def ml_files_route(filename, folder):
    if filename != "" and os.path.exists(config['development'].ML_FILES_DIR + '/' + folder + '/' + filename):
        return send_from_directory(config['development'].ML_FILES_DIR + '/' + folder, filename)
    else:
        return render_template('index.html')
        
mlfilesprint.add_url_rule(
    "/<path:folder>/<path:filename>", 
    view_func=ml_files_route, 
    methods=["GET"]
)
