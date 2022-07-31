import os
from api.config import config
from flask.views import MethodView
from flask import jsonify, make_response
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
from flask.signals import Namespace

from api.models.Notification import Notification

from api.helpers.notification import (
  fetch_all_user_notifications,
  save_notification
)
from api.extensions import socketio

namespace = Namespace()
notification = namespace.signal('notification')

allowed_types = config[os.getenv("FLASK_CONFIG") or "development"].NOTIFICATION_TYPES_ALLOWED

class FetchUserNotificationsView(MethodView):
    '''
    This route fetches all notifications related to a user
    /api/v1/notifications/<int:user_id>
    '''
    @jwt_required
    def get(self):  
        try:
            current_user = get_jwt_identity()
            user_notifications = fetch_all_user_notifications(current_user)

            if not user_notifications:
                response = {
                    "success": False,
                    "msg": "No notifications found"
                }
                return make_response(jsonify(response)), 404

            response = {
            "success": True,
            "msg": "Notifications fetched successfully.",
            "body": user_notifications
            }
            return make_response(jsonify(response)), 200

        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Notifications could not be fetched."
            }
            return make_response(jsonify(response)), 500

    @notification.connect
    def send_notification(app, **kwargs):
        try:
            message=kwargs["message"]
            users=kwargs["users"]
            type=kwargs["type"]
        except KeyError as err:
            socketio.emit('notification_error', f'{str(err)} key is missing')
        
        if type not in allowed_types:
            socketio.emit('notification_error', 'Type not allowed')

        for user in users: 
            try:
                notification = Notification (
                message = message,
                type = type,
                user_id = user
                )
            except Exception as err:
                socketio.emit('notification_error', f'Something went wrong!')
            
            new_notification = save_notification(notification)
            socketio.emit('notification', new_notification)


notifications_controller = {
  'fetch_user_notifications': FetchUserNotificationsView.as_view('fetch_user_notifications'),
}
