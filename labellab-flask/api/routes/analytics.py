from flask import Blueprint

from api.controllers import analyticscontroller

analyticsprint = Blueprint("analytics", __name__)

analyticsprint.add_url_rule(
    "/time_label/get/<int:project_id>", 
    view_func=analyticscontroller.analyticsController["time_label"], 
    methods=["GET"]
)

analyticsprint.add_url_rule(
    "/label_counts/get/<int:project_id>", 
    view_func=analyticscontroller.analyticsController["label_counts"], 
    methods=["GET"]
)
