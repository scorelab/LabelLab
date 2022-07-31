from flask import Blueprint

from api.controllers.notificationscontroller import notifications_controller

notificationsprint = Blueprint("notifications", __name__)

notificationsprint.add_url_rule(
    '/notifications',
    view_func=notifications_controller['fetch_user_notifications'], 
    methods=['GET'],
)