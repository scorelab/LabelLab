from controllers.auth import authController
from flask import Blueprint

authBlueprint = Blueprint("auth", __name__)

authBlueprint.add_url_rule(
    "register", view_func=authController.register, methods=['POST']
)

authBlueprint.add_url_rule(
    "login", view_func=authController.login, methods=['POST']
)
