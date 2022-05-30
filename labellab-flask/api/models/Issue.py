from datetime import datetime
from flask import current_app

from api.extensions import db, Base

class Issue(db.Model):
    """
    This model holds information about an Issue
    """
    __tablename__ = "issue"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.String(256))
    project_id = db.Column(db.Integer, 
                        db.ForeignKey('project.id', ondelete="cascade", onupdate="cascade"),
                        nullable=False)
    created_by = db.Column(db.Integer, 
                        db.ForeignKey('user.id', ondelete="cascade", onupdate="cascade"),
                        nullable=False)
    assignee_id = db.Column(db.Integer, 
                        db.ForeignKey('user.id', ondelete="cascade", onupdate="cascade"),
                        nullable=True)
    team_id = db.Column(db.Integer, 
                        db.ForeignKey('team.id', ondelete="cascade", onupdate="cascade"),
                        nullable=True)        
    category = db.Column(db.String(20), nullable=False)
    priority = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    entity_type = db.Column(db.String(10))
    entity_id = db.Column(db.Integer)
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 
 
    def __init__(self, title, description, project_id, created_by, assignee_id, team_id, category, priority, status, entity_type, entity_id, due_date):
        self.title = title
        self.description = description
        self.project_id = project_id
        self.created_by = created_by
        self.assignee_id = assignee_id
        self.team_id = team_id
        self.category = category
        self.priority = priority
        self.status = status
        self.entity_type = entity_type
        self.entity_id = entity_id
        self.due_date = due_date

    def __repr__(self):
        """
        Returns the object representation
        """
        return "<Issue(issue_id='%s', issue_title='%s', issue_description='%s')>" % (self.id, self.title, self.description)