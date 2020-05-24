from datetime import datetime
from flask import current_app

from ..database import db, Column, Model
from ..extensions import Base

class Label(Model):
    """
    This model holds information about a user registered
    """
    __tablename__ = "label"

    id = Column(db.Integer, primary_key=True)
    labelname = Column(db.String(128), nullable=False,)
    label_type = Column(db.String(80), nullable=False,)
    count = Column(db.Integer,
                   default = 0)
    project_id = Column(db.Integer, 
                        db.ForeignKey('project.id'),
                        nullable=False)
    labelsdata = db.relationship('labeldata', 
                                 backref='label',
                                 lazy=True,
                                 cascade="all, delete-orphan")
    
    def __init__(self, labelname, label_type, count, project_id):
        """
        Initializes the label instance
        """
        self.labelname = labelname
        self.label_type = label_type
        self.count = count
        self.project_id = project_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<Label %r>" % self.labelname
