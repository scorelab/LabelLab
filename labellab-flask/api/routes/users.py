from flask import Blueprint

from api.controllers import userscontroller

usersprint = Blueprint("users", __name__)

usersprint.add_url_rule(
    "/auth/login", 
    view_func=userscontroller.userController["login"], 
    methods=["POST"]
)

usersprint.add_url_rule(
    "/auth/register", 
    view_func=userscontroller.userController["register"], 
    methods=["POST"]
)