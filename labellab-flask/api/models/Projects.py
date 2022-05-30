from datetime import datetime
from flask import current_app, jsonify

from api.extensions import db, Base

class Project(db.Model):
    """
    This model holds information about a project and its admin
    """
    __tablename__ = "project"

    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(80), nullable=False,)
    project_description = db.Column(db.String(128),
                                default = 'Image labelling')
    admin_id = db.Column(db.Integer, 
                      db.ForeignKey('user.id', ondelete="cascade", onupdate="cascade"),
                      nullable=False)
    labels = db.relationship('Label', 
                             backref='project',
                             lazy=True,
                             cascade="all, save-update, delete",
                             passive_deletes=True)
    images = db.relationship('Image', 
                             backref='project',
                             lazy=True,
                             cascade="all, save-update, delete",
                             passive_deletes=True)
    models = db.relationship('MLClassifier',
                             backref='project',
                             lazy=True,
                             cascade="all, save-update, delete",
                             passive_deletes=True)
    issues = db.relationship('Issue',
                             backref='project',
                             lazy=True,
                             cascade="all, save-update, delete",
                             passive_deletes=True)
    
    def __init__(self, project_name, project_description, admin_id):
        """
        Initializes the project instance
        """
        self.project_name = project_name
        self.project_description = project_description
        self.admin_id = admin_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<Project(project_name='%s', project_id='%s', project_description='%s')>" % (self.project_name, self.id, self.project_description)
