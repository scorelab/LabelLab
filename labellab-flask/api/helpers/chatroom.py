from sqlalchemy import desc

from api.extensions import db
from api.models.Message import Message

# Get all messages of a team
def get_all_messages(team_id):
  messages = Message.query.filter_by(team_id=team_id).order_by(desc('timestamp')).all()
  return list(map(lambda message: to_json(message), messages))

# Save message
def save_message(body, team_id, user_id, username):
  message = Message(body=body, team_id=team_id, user_id=user_id, username=username)
  db.session.add(message)
  db.session.commit()
  return to_json(message)

def to_json(message):
  return {
    'id': message.id,
    'body': message.body,
    'team_id': message.team_id,
    'user_id': message.user_id,
    'username': message.username,
    'timestamp': str(message.timestamp),
  }