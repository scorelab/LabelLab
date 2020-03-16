from flask import Blueprint
from controllers.auth import authController

authBlueprint = Blueprint("auth", __name__)

authBlueprint.add_url_rule(
    "register", view_func=authController.register, methods=['POST']
)

authBlueprint.add_url_rule(
    "login", view_func=authController.login, methods=['POST']
)