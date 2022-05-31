from flask import Blueprint

from api.controllers import issuecontroller

issuesprint = Blueprint("issues", __name__)

issuesprint.add_url_rule(
    "/issue/<int:project_id>",
    view_func=issuecontroller.issueController["get_all_issues"], 
    methods=["GET"]
)
