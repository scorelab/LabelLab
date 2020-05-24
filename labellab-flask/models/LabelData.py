from datetime import datetime
from flask import current_app

from ..database import db, Column, Model
from ..extensions import Base

class LabelData(Model):
    """
    This model holds information about a user registered
    """
    __tablename__ = "labeldata"

    id = Column(db.Integer, primary_key=True)
    months_passed = Column(db.Integer)
    latitude = Column(db.Integer)
    longitude = Column(db.Integer)
    image_id = Column(db.Integer, 
                      db.ForeignKey('image.id'),
                      nullable=False)
    label_id = Column(db.Integer, 
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
