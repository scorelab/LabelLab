from flask import Blueprint

from api.controllers import issuecontroller

issuesprint = Blueprint("issues", __name__)

issuesprint.add_url_rule(
    "/issue/create/<int:project_id>",
    view_func=issuecontroller.issueController["createissue"], 
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
    "issue/<int:project_id>/category/<string:category>",
    view_func=issuecontroller.issueController["fetch_category_issue"], 
    methods=["GET"]
)

issuesprint.add_url_rule(
    "issue/<int:project_id>/team/<string:team>",
    view_func=issuecontroller.issueController["fetch_team_issue"], 
    methods=["GET"]
)