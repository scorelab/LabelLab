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
    
    def __init__(self, user_id, project_id, team_id):
        """
        Initializes the projectMember instance
        """
        self.user_id = user_id
        self.team_id = team_id

    # def __repr__(self):
    #     """
    #     Returns the object reprensentation
    #     """
    #     return "<ProjectMember %r>" % self.user_id
    
    def to_json(self):
        """
        Returns a JSON object
        """
        projectmember_json = {"projectMemberId": self.user_id, 
                              "teamId": self.team_id}
        return projectmember_json
    
    @classmethod
    def find_projectmember(cls, user_id, team_id):
        return cls.query.filter_by(user_id=user_id, 
                                   team_id=team_id).first()
    
    @classmethod
    def find_by_team_name(cls, teamname):
        return cls.query.filter_by(teamname=teamname).all()
    
    @classmethod
    def find_all_teams_of_user(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()
    
    def save(self):
        """
        Save a team to the database.
        This includes creating a new user and editing one.
        """
        db.session.add(self)
        db.session.commit()
        projectmember_json = {"projectMemberId": self.user_id, 
                              "teamId": self.team_id}
        return projectmember_json
