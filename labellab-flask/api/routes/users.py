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

usersprint.add_url_rule(
    "/users/info",
    view_func=userscontroller.userController["user"],
    methods=["GET"]
)

usersprint.add_url_rule(
    "/users/get",
    view_func=userscontroller.userController["get_all_users"],
    methods=["GET"]
)

usersprint.add_url_rule(
    "/users/count_info",
    view_func=userscontroller.userController["count_info"],
    methods=["GET"]
)

usersprint.add_url_rule(
    '/users/search/<string:query>',
    view_func=userscontroller.userController["search_users"],
    methods=["GET"]
)

usersprint.add_url_rule(
    '/users/edit/',
    view_func=userscontroller.userController["edit_user"],
    methods=["PUT"]
)

usersprint.add_url_rule(
    '/auth/update-password',
    view_func=userscontroller.userController["update_password"],
    methods=["PUT"]
)