from datetime import datetime
from flask import current_app

from api.extensions import db, Base

class Team(db.Model):
    """
    This model holds information about a team in a project
    """
    __tablename__ = "team"

    id = db.Column(db.Integer, primary_key=True)
    teamname = db.Column(db.String(80), nullable=False,)
    role = db.Column(db.String(128),
                  default = 'Member')
    project_id = db.Column(db.Integer, 
                        db.ForeignKey('project.id'),
                        nullable=False)
    team_members = db.relationship('PojectMember', 
                                    backref='team',
                                    lazy=True,
                                    cascade="all, delete-orphan")
    
    def __init__(self, teamname, role, project_id):
        """
        Initializes the team instance
        """
        self.teamname = teamname
        self.role = role
        self.project_id = project_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<Team %r>" % self.teamname
