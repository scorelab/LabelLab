from datetime import datetime
from flask import current_app, jsonify

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
                            db.ForeignKey('project.id', ondelete="cascade", onupdate="cascade"),
                            nullable=False)
    team_members = db.relationship('ProjectMember', 
                                    backref='team',
                                    lazy=True,
                                    cascade="all, save-update, delete",
                                    passive_deletes=True)
    
    def __init__(self, teamname, role, project_id):
        """
        Initializes the team instance
        """
        self.teamname = teamname
        self.role = role
        self.project_id = project_id

    # def __repr__(self):
    #     """
    #     Returns the object reprensentation
    #     """
    #     return "<Team %r>" % self.teamname
    def to_json(self):
        """
        Returns a JSON object
        """
        team_json = {"teamId": self.id, 
                     "teamName": self.teamname,
                     "role": self.role}
        return team_json
    
    @classmethod
    def find_by_team_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def find_by_team_name(cls, name):
        return cls.query.filter_by(name=name).first()
    
    @classmethod
    def find_all_teams(cls, project_id):
        return cls.query.filter_by(project_id=project_id).first()
    
    def save(self):
        """
        Save a team to the database.
        This includes creating a new user and editing one.
        """
        db.session.add(self)
        db.session.commit()
        team_json = {"teamId": self.id, 
                     "teamName": self.teamname,
                     "role": self.role}
        return team_json
        
