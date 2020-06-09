from datetime import datetime
from flask import current_app, jsonify

from api.extensions import db, Base

class ProjectMember(db.Model):
    """
    This model holds information about a projectmember registered
    """
    __tablename__ = "projectmember"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,
                     db.ForeignKey('user.id', ondelete="cascade", onupdate="cascade"),
                     nullable=False)
    team_id = db.Column(db.Integer,
                     db.ForeignKey('team.id', ondelete="cascade", onupdate="cascade"), 
                     nullable=False)
    
    def __init__(self, user_id, team_id):
        """
        Initializes the projectMember instance
        """
        self.user_id = user_id
        self.team_id = team_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<ProjectMember %r>" % self.id
