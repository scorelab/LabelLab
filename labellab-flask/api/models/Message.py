from datetime import datetime

from api.extensions import db

class Message(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  body = db.Column(db.String(200), nullable=False)
  team_id = db.Column(db.Integer, nullable=False)
  user_id = db.Column(db.Integer, nullable=False)
  username = db.Column(db.String(20), nullable=False)
  entity_type = db.Column(db.String(10))
  entity_id = db.Column(db.Integer)
  timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

  def __init__(self, body, team_id, user_id, username, entity_type=None, entity_id=None):
    self.body = body
    self.team_id = team_id
    self.user_id = user_id
    self.username = username
    self.entity_type = entity_type
    self.entity_id = entity_id
