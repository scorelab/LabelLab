from datetime import datetime
from flask import current_app

from api.extensions import db, Base

class LabelData(db.Model):
    """
    This model holds information about the labeldata of a label to an image
    """
    __tablename__ = "labeldata"

    id = db.Column(db.Integer, primary_key=True)
    months_passed = db.Column(db.Integer)
    latitude = db.Column(db.Integer)
    longitude = db.Column(db.Integer)
    image_id = db.Column(db.Integer, 
                      db.ForeignKey('image.id'),
                      nullable=False)
    label_id = db.Column(db.Integer, 
                      db.ForeignKey('label.id'),
                      nullable=False)
    
    def __init__(self, image_id, label_id):
        """
        Initializes the LabelData instance
        """
        self.image_id = image_id
        self.label_id = label_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<LabelData %r>" % self.id
