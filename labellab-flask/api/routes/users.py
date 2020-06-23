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

usersprint.add_url_rule(
    "/auth/logout_access",
    view_func=userscontroller.userController["logout_access"],
    methods=["POST"]
)

usersprint.add_url_rule(
    "/auth/logout_refresh",
    view_func=userscontroller.userController["logout_refresh"],
    methods=["POST"]
)

usersprint.add_url_rule(
    "/auth/token_refresh",
    view_func=userscontroller.userController["token_refresh"],
    methods=["POST"]
)

usersprint.add_url_rule(
    "/auth/oauth",
    view_func=userscontroller.userController["oauth"],
    methods=["POST"]
)
