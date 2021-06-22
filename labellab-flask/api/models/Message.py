from datetime import datetime

from api.extensions import db

class Message(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  body = db.Column(db.String(200), nullable=False)
  team_id = db.Column(db.Integer, nullable=False)
  user_id = db.Column(db.Integer, nullable=False)
  username = db.Column(db.String(20), nullable=False)
  timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

  def __init__(self, body, team_id, user_id, username):
    self.body = body
    self.team_id = team_id
    self.user_id = user_id
    self.username = username
