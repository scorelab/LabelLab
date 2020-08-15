from datetime import datetime
from flask import current_app

from api.extensions import db, Base

class Image(db.Model):
    """
    This model holds information about an image in a project
    """
    __tablename__ = "image"

    id = db.Column(db.Integer, primary_key=True)
    image_name = db.Column(db.String(255), nullable=False,)
    image_url = db.Column(db.String(255), nullable=False,)
    height = db.Column(db.Integer)
    width = db.Column(db.Integer)
    labelled = db.Column(db.Boolean,
                      default = False)
    project_id = db.Column(db.Integer, 
                        db.ForeignKey('project.id', ondelete="cascade", onupdate="cascade"),
                        nullable=False)
    labeldata = db.relationship('LabelData', 
                                 backref='image',
                                 lazy=True,
                                 cascade="all, save-update, delete",
                                 passive_deletes=True)
    
    def __init__(self, image_name, image_url, height, width, labelled, project_id):
        """
        Initializes the image instance
        """
        self.image_name = image_name
        self.image_url = image_url
        self.height = height
        self.width = width
        self.labelled = labelled
        self.project_id = project_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<Image %r>" % self.image_name
