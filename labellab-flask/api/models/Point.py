from datetime import datetime
from flask import current_app

from api.extensions import db, Base

class Point(db.Model):
    """
    This model holds information about the point of a particular
    label to an image.
    """
    __tablename__ = "point"

    id = db.Column(db.Integer, primary_key=True)
    y_coordinate = db.Column(db.Float, nullable=False)
    x_coordinate = db.Column(db.Float, nullable=False)
    labeldata_id = db.Column(db.Integer, 
                      db.ForeignKey('labeldata.id', ondelete="cascade", onupdate="cascade"),
                      nullable=False)
    
    def __init__(self, y_coordinate, x_coordinate, labeldata_id):
        """
        Initializes the Point instance
        """
        self.labeldata_id = labeldata_id
        self.y_coordinate = y_coordinate
        self.x_coordinate = x_coordinate

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<Point %r>" % self.id
