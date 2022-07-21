from datetime import datetime
from flask import current_app

from api.extensions import db, Base

class Notification(db.Model):
    """
    This model holds information about a notification
    """
    __tablename__ = "notification"

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id', ondelete="cascade", onupdate="cascade"), nullable=False)
    type = db.Column(db.String(50), nullable=False)

    def __init__(self, message, user_id, type):
        self.message = message
        self.user_id = user_id
        self.type = type

    def __repr__(self):
        """
        Returns the object representation
        """
        return "<Notification %r>" % self.message
        