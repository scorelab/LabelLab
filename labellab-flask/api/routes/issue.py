from flask import Blueprint

from api.controllers import issuecontroller

issuesprint = Blueprint("issues", __name__)

issuesprint.add_url_rule(
    "/issue/create/<int:project_id>",
    view_func=issuecontroller.issueController["create_issue"], 
    methods=["POST"]
)

issuesprint.add_url_rule(
    "/issue/get/<int:project_id>",
    view_func=issuecontroller.issueController["get_all_issues"], 
    methods=["GET"]
)

issuesprint.add_url_rule(
    "/issue/issue_info/<int:project_id>/<int:issue_id>",
    view_func=issuecontroller.issueController["issue"], 
    methods=["GET","DELETE","PUT"]
)

issuesprint.add_url_rule(
    "/issue/assign/<int:project_id>/<int:issue_id>",
    view_func=issuecontroller.issueController["assign_issue"], 
    methods=["PUT"]
)

issuesprint.add_url_rule(
    "issue/<int:project_id>/category/<string:category>",
    view_func=issuecontroller.issueController["fetch_category_issue"], 
    methods=["GET"]
)

issuesprint.add_url_rule(
    "issue/<int:project_id>/team/<int:team_id>",
    view_func=issuecontroller.issueController["fetch_team_issue"], 
    methods=["GET"]
)

issuesprint.add_url_rule(
    "issue/<int:project_id>/entity/<string:entity_type>/<int:entity_id>",
    view_func=issuecontroller.issueController["fetch_entity_issue"], 
    methods=["GET"]
)