from flask import Blueprint

from api.controllers import teamscontroller

teamsprint = Blueprint("teams", __name__)

teamsprint.add_url_rule(
    "/team/get", 
    view_func=teamscontroller.teamController["get_all_teams"], 
    methods=["GET"]
)

teamsprint.add_url_rule(
    "/team/team_info/<int:project_id>/<int:team_id>", 
    view_func=teamscontroller.teamController["team"], 
    methods=["GET","DELETE","PUT"]
)

teamsprint.add_url_rule(
    "/team/add_team_member/<int:project_id>/<int:team_id>", 
    view_func=teamscontroller.teamController["add_team_member"], 
    methods=["POST"]
)

teamsprint.add_url_rule(
    "/team/remove_team_member/<int:project_id>/<int:team_id>", 
    view_func=teamscontroller.teamController["remove_team_member"], 
    methods=["POST"]
)