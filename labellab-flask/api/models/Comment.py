from datetime import datetime
from flask import current_app

from api.extensions import db, Base

class Comment(db.Model):
    """
    This model holds information about a comment made by user
    """
    __tablename__ = "comment"

    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(200), nullable=False)
    issue_id = db.Column(db.Integer, 
                        db.ForeignKey('issue.id', ondelete="cascade", onupdate="cascade"),
                        nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id', ondelete="cascade", onupdate="cascade"), nullable=False)
    username = db.Column(db.String(20),db.ForeignKey('user.username', ondelete="cascade", onupdate="cascade"), nullable=False)
    thumbnail = db.Column(db.String(1500), 
                       default='https://react.semantic-ui.com/images/avatar/large/elliot.jpg')
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __init__(self, body, issue_id, user_id, username, thumbnail):
        self.body = body
        self.issue_id = issue_id
        self.user_id = user_id
        self.username = username
        self.thumbnail = thumbnail

    def __repr__(self):
        """
        Returns the object representation
        """
        return "<Comment %r>" % self.id