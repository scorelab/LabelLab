from flask import Blueprint

from api.controllers import projectscontroller

projectsprint = Blueprint("projects", __name__)

projectsprint.add_url_rule(
    "/project/create",
    view_func=projectscontroller.projectController["createproject"], 
    methods=["POST"]
)

projectsprint.add_url_rule(
    "/project/get",
    view_func=projectscontroller.projectController["get_all_projects"], 
    methods=["GET"]
)

projectsprint.add_url_rule(
    "/project/project_info/<int:project_id>",
    view_func=projectscontroller.projectController["project"], 
    methods=["GET","DELETE","PUT"]
)

projectsprint.add_url_rule(
    "/project/add_project_member/<int:project_id>",
    view_func=projectscontroller.projectController["add_project_member"], 
    methods=["POST"]
)

projectsprint.add_url_rule(
    "/project/remove_project_member/<int:project_id>",
    view_func=projectscontroller.projectController["remove_project_member"], 
    methods=["POST"]
)

projectsprint.add_url_rule(
    "/project/polylines/<int:project_id>",
    view_func=projectscontroller.projectController["get_coordinates"], 
    methods=["GET"]
)

projectsprint.add_url_rule(
    "/project/leave/<int:project_id>",
    view_func=projectscontroller.projectController["leave_project"], 
    methods=["GET"]
)

projectsprint.add_url_rule(
    "/project/make_admin/<int:project_id>",
    view_func=projectscontroller.projectController["make_admin"], 
    methods=["POST"]
)

projectsprint.add_url_rule(
    "/project/member_roles/<int:project_id>",
    view_func=projectscontroller.projectController["member_roles"], 
    methods=["GET"]
)

projectsprint.add_url_rule(
    "/project/remove_admin/<int:project_id>",
    view_func=projectscontroller.projectController["remove_admin"], 
    methods=["POST"]
)