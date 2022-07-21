from email import message
import os
from api.config import config
from flask.views import MethodView
from flask import jsonify, make_response
from flask_jwt_extended import jwt_required
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
    def get(self, user_id):
        user_notifications = fetch_all_user_notifications(user_id)
        response = {
        'success': True,
        'data': user_notifications,
        }
        return make_response(jsonify(response)), 200

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
