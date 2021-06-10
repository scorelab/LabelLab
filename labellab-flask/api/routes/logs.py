from flask import Blueprint

from api.controllers.logscontroller import logs_controller

logs_blueprint = Blueprint("logs", __name__)

logs_blueprint.add_url_rule(
    '/logs/<int:project_id>',
    view_func=logs_controller['fetch_project_logs'], 
    methods=['GET'],
)

logs_blueprint.add_url_rule(
    '/logs/<int:project_id>/category/<string:category>',
    view_func=logs_controller['fetch_category_logs'],
    methods=['GET'],
)

logs_blueprint.add_url_rule(
    '/logs/<int:project_id>/user/<string:user_email>',
    view_func=logs_controller['fetch_user_logs'],
    methods=['GET'],
)

logs_blueprint.add_url_rule(
    '/logs/<int:project_id>/entity/<string:entity_type>/<int:entity_id>',
    view_func=logs_controller['fetch_entity_logs'],
    methods=['GET'],
)