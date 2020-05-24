from datetime import datetime
from flask import current_app

from ..database import db, Column, Model
from ..extensions import Base

class Team(Model):
    """
    This model holds information about a user registered
    """
    __tablename__ = "team"

    id = Column(db.Integer, primary_key=True)
    teamname = Column(db.String(80), nullable=False,)
    role = Column(db.String(128),
                  default = 'Member')
    project_id = Column(db.Integer, 
                        db.ForeignKey('project.id'),
                        nullable=False)
    team_members = db.relationship('projectmember', 
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
