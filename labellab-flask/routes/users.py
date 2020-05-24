from flask import Blueprint

from ..controllers import userscontroller

usersprint = Blueprint("users", __name__)

usersprint.add_url_rule(
    "/login", view_func=userscontroller.login_user, methods=["GET"]
)