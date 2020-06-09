from datetime import datetime
from flask import current_app, jsonify

from api.extensions import db, Base

class Team(db.Model):
    """
    This model holds information about a team in a project
    """
    __tablename__ = "team"

    id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(80), nullable=False,)
    role = db.Column(db.String(128),
                     default = 'Member')
    project_id = db.Column(db.Integer, 
                            db.ForeignKey('project.id', ondelete="cascade", onupdate="cascade"),
                            nullable=False)
    team_members = db.relationship('ProjectMember', 
                                    backref='team',
                                    lazy=True,
                                    cascade="all, save-update, delete",
                                    passive_deletes=True)
    
    def __init__(self, team_name, role, project_id):
        """
        Initializes the team instance
        """
        self.team_name = team_name
        self.role = role
        self.project_id = project_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<Team %r>" % self.team_name
        
