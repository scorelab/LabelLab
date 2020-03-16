from controllers.classification import classificationController
from flask import Blueprint

classificationBlueprint = Blueprint("auth", __name__)

classificationBlueprint.add_url_rule(
    "classification", view_func=classificationController.classifyGet, methods=['GET']
)

classificationBlueprint.add_url_rule(
    "classification", view_func=classificationController.classifyPost, methods=['POST']
)
