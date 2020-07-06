from datetime import datetime
from flask import current_app

from api.extensions import db, Base

class LabelData(db.Model):
    """
    This model holds information about the labeldata of a label to an image,
    This acts as an intermediary table for a many to many relationship b/w 
    images and labels
    """
    __tablename__ = "labeldata"

    id = db.Column(db.String(45), primary_key=True)
    months_passed = db.Column(db.Integer)
    image_id = db.Column(db.Integer, 
                      db.ForeignKey('image.id', ondelete="cascade", onupdate="cascade"),
                      nullable=False)
    label_id = db.Column(db.Integer, 
                      db.ForeignKey('label.id', ondelete="cascade", onupdate="cascade"),
                      nullable=False)
    points = db.relationship('Point', 
                             backref='labeldata',
                             lazy=True,
                             cascade="all, save-update, delete",
                             passive_deletes=True)
    
    def __init__(self, id, image_id, label_id):
        """
        Initializes the LabelData instance
        """
        self.id = id
        self.image_id = image_id
        self.label_id = label_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<LabelData %r>" % self.id
