from datetime import datetime
from flask import current_app, jsonify

from api.extensions import db, Base
<<<<<<< HEAD
from api.models.Team import Team
from api.models.User import User
=======
>>>>>>> ea40d4a... Update user helpers

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
    models = db.relationship('MLModel',
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
        return "<Project %r>" % self.project_name