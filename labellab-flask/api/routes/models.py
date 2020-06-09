from flask import Blueprint

from api.controllers import modelscontroller

modelsprint = Blueprint("models", __name__)

modelsprint.add_url_rule(
    "/models/save",
    view_func=modelscontroller.modelController["save"],
    methods=["POST"]
)
