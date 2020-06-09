from datetime import datetime
from flask import current_app

from api.extensions import db, Base

"""
This table is an association table for 
a many to many relationship between images and labels
"""

class Image(db.Model):
    """
    This model holds information about an image in a project
    """
    __tablename__ = "image"

    id = db.Column(db.Integer, primary_key=True)
    imagename = db.Column(db.String(128), nullable=False,)
    image_url = db.Column(db.String(80), nullable=False,)
    height = db.Column(db.Integer)
    width = db.Column(db.Integer)
    labelled = db.Column(db.Boolean,
                      default = False)
    project_id = db.Column(db.Integer, 
                        db.ForeignKey('project.id', ondelete="cascade", onupdate="cascade"),
                        nullable=False)
    labelsdata = db.relationship('LabelData', 
                                 backref='image',
                                 lazy=True,
                                 cascade="all, save-update, delete",
                                 passive_deletes=True)
    
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
