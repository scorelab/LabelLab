from flask import Blueprint

from api.controllers import classificationscontroller

classificationsprint = Blueprint("classifications", __name__)

classificationsprint.add_url_rule(
    "/classification/classify",
    view_func=classificationscontroller.classificationController["classify_image"],
    methods=["POST"])

classificationsprint.add_url_rule(
    "/classification/get/<int:classification_id>",
    view_func=classificationscontroller.classificationController["get_classification"],
    methods=["GET"])

classificationsprint.add_url_rule(
    "/classification/all",
    view_func=classificationscontroller.classificationController["get_all_classifications"],
    methods=["GET"])

classificationsprint.add_url_rule(
    "/classification/delete/<int:classification_id>",
    view_func=classificationscontroller.classificationController["delete_classification"],
    methods=["DELETE"])
