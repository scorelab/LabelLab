from datetime import datetime
from flask import current_app

from ..database import db, Column, Model
from ..extensions import Base

class Poject(Model):
    """
    This model holds information about a user registered
    """
    __tablename__ = "project"

    id = Column(db.Integer, primary_key=True)
    projectname = Column(db.String(80), nullable=False,)
    projectdescription = Column(db.String(128),
                                default = 'Image labelling')
    admin_id = Column(db.Integer, 
                      db.ForeignKey('user.id'),
                      nullable=False)
    projectmembers = db.relationship('projectmember', 
                                      backref='project',
                                      lazy=True,
                                      cascade="all, delete-orphan")
    labels = db.relationship('label', 
                             backref='project',
                             lazy=True,
                             cascade="all, delete-orphan")
    images = db.relationship('image', 
                             backref='project',
                             lazy=True,
                             cascade="all, delete-orphan")
    
    def __init__(self, projectname, projectdescription, admin_id):
        """
        Initializes the project instance
        """
        self.projectname = projectname
        self.projectdescription = projectdescription
        self.admin_id = admin_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<Project %r>" % self.projectname
