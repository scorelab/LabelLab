from flask import Blueprint

from api.controllers import classificationscontroller

classificationsprint = Blueprint("classifications", __name__)

classificationsprint.add_url_rule(
    "/classification/classify",
    view_func=classificationscontroller.classificationController["classify_image"],
    methods=["POST"])
