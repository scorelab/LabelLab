from datetime import datetime
from flask import current_app

from ..database import db, Column, Model
from ..extensions import Base

class Image(Model):
    """
    This model holds information about a user registered
    """
    __tablename__ = "image"

    id = Column(db.Integer, primary_key=True)
    imagename = Column(db.String(128), nullable=False,)
    image_url = Column(db.String(80), nullable=False,)
    height = Column(db.Integer)
    width = Column(db.Integer)
    labelled = Column(db.Boolean,
                      default = False)
    project_id = Column(db.Integer, 
                        db.ForeignKey('project.id'),
                        nullable=False)
    labelsdata = db.relationship('labeldata', 
                                 backref='image',
                                 lazy=True,
                                 cascade="all, delete-orphan")
    
    def __init__(self, imagename, image_url, height, width, labelled, project_id):
        """
        Initializes the image instance
        """
        self.imagename = imagename
        self.image_url = image_url
        self.height = height
        self.width = width
        self.labelled = labelled
        self.project_id = project_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<Image %r>" % self.imagename
