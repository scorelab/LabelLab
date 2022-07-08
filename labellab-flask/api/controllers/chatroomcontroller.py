import os
import json
from os import error
from flask.views import MethodView
from flask import jsonify, make_response
from flask_jwt_extended import jwt_required
from api.extensions import socketio

from api.config import config
from api.models.Message import Message
from api.helpers.team import find_by_id
from api.helpers.user import find_by_user_id
from api.helpers.chatroom import get_all_messages, save_message

allowed_tags = config[os.getenv("FLASK_CONFIG") or "development"].TAGS_ALLOWED

class GetMessages(MethodView):
  '''
  This view returns all messages of a team
  api/v1/chatroom/<int:team_id>/messages
  '''
  @jwt_required
  def get(self, team_id):
    try:
      team = find_by_id(team_id)
      if not team:
        response = {
          'success': False,
          'msg': 'Team does not exist'
        }
        return make_response(jsonify(response)), 404

      messages = get_all_messages(team_id)
      response = {
        'success': True,
        'body': messages,
      }
      return make_response(jsonify(response)), 200
      
    except Exception as err:
      print(err)
      response = {
        'success': False,
        'msg': 'Something went wrong'
      }
    return make_response(jsonify(response)), 500



@socketio.on('send_message')
def handle_send_message_event(data):
  try:
    body = data['body']
    team_id = data['team_id']
    user_id = data['user_id']
  except KeyError as err:
    socketio.emit('message_error', f'${str(err)} key is missing')
  user = find_by_user_id(user_id)
  username = user['username']
  message = Message(
    body=body,
    team_id=team_id,
    user_id=user_id,
    username=username
  )
  try: 
    entity_type = data['entity_type']
    entity_id = data['entity_id']
    if entity_type not in allowed_tags:
      socketio.emit('message_error', 'Tag type not allowed')
    message.entity_type = entity_type
    message.entity_id =entity_id
  except:
    pass
  new_message = save_message(message)
  socketio.emit('receive_message', new_message)


chatroom_controller = {
  'get_messages': GetMessages.as_view('get_messages'),
}