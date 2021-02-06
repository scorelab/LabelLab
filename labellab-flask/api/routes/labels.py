from flask import Blueprint

from api.controllers import labelscontroller

labelsprint = Blueprint("labels", __name__)

labelsprint.add_url_rule(
    "/label/create/<int:project_id>", 
    view_func=labelscontroller.labelController["create_label"], 
    methods=["POST"]
)

labelsprint.add_url_rule(
    "/label/get/<int:project_id>", 
    view_func=labelscontroller.labelController["get_all_labels"], 
    methods=["GET"]
)

labelsprint.add_url_rule(
    "/label/label_info/<int:label_id>/<int:project_id>", 
    view_func=labelscontroller.labelController["label"], 
    methods=["GET","DELETE","PUT"]
)