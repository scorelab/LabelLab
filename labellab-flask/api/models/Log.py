from datetime import datetime

from api.extensions import db

class Log(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  message = db.Column(db.String(120), nullable=False)
  category = db.Column(db.String(10), nullable=False)
  entity_type = db.Column(db.String(10))
  entity_id = db.Column(db.Integer)
  user_id = db.Column(db.Integer, nullable=False)
  project_id = db.Column(db.Integer, nullable=False)
  timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

  def __init__(self, message, category, entity_type, entity_id, user_id, project_id):
    self.message = message
    self.category = category
    self.entity_type = entity_type
    self.entity_id = entity_id
    self.user_id = user_id
    self.project_id = project_id