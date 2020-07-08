from flask import Blueprint

from api.controllers import mlclassifierscontroller

mlclassifiersprint = Blueprint("mlclassifiers", __name__)

# Create a new model
mlclassifiersprint.add_url_rule(
    "/mlclassifier",
    view_func=mlclassifierscontroller.mlclassifiercontroller["create"],
    methods=["POST"]
)

# Edit an existing new model
mlclassifiersprint.add_url_rule(
    "/mlclassifier/<int:mlclassifier_id>",
    view_func=mlclassifierscontroller.mlclassifiercontroller["mlclassifier"],
    methods=["PUT"]
)

# Get an existing new model
mlclassifiersprint.add_url_rule(
    "/mlclassifier/<int:mlclassifier_id>",
    view_func=mlclassifierscontroller.mlclassifiercontroller["mlclassifier"],
    methods=["GET"]
)

# Delete a model
mlclassifiersprint.add_url_rule(
    "/mlclassifier/<int:mlclassifier_id>",
    view_func=mlclassifierscontroller.mlclassifiercontroller["mlclassifier"],
    methods=["DELETE"]
)

# Get all models in a project
mlclassifiersprint.add_url_rule(
    "/mlclassifier/all/<int:project_id>",
    view_func=mlclassifierscontroller.mlclassifiercontroller["get_all_models"],
    methods=["GET"]
)

# Train a saved model
mlclassifiersprint.add_url_rule(
    "/mlclassifier/train/<int:mlclassifier_id>",
    view_func=mlclassifierscontroller.mlclassifiercontroller["train"],
    methods=["POST"]
)

# Test a trained model
mlclassifiersprint.add_url_rule(
    "/mlclassifier/test/<int:mlclassifier_id>",
    view_func=mlclassifierscontroller.mlclassifiercontroller["test"],
    methods=["POST"]
)

# Export a model in specified format
mlclassifiersprint.add_url_rule(
    "/mlclassifier/export/<int:mlclassifier_id>",
    view_func=mlclassifierscontroller.mlclassifiercontroller["export"],
    methods=["GET"]
)

# Upload a model for training
mlclassifiersprint.add_url_rule(
    "/mlclassifier/upload/<int:mlclassifier_id>",
    view_func=mlclassifierscontroller.mlclassifiercontroller["upload"],
    methods=["POST"]
)