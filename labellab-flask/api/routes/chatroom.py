from flask import Blueprint

from api.controllers import chatroomcontroller

chatroomprint = Blueprint('chatroom', __name__)

chatroomprint.add_url_rule(
    '/chatroom/<int:team_id>', 
    view_func=chatroomcontroller.chatroom_controller['get_messages'], 
    methods=["GET"]
)