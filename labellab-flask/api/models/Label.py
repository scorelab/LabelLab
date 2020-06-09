from datetime import datetime
from flask import current_app

from api.extensions import db, Base

model_has_label = db.Table("model_has_label",
                    db.Column("model_id", db.Integer, db.ForeignKey("model.id")),
                    db.Column("label_id", db.Integer, db.ForeignKey("label.id")),
                    db.PrimaryKeyConstraint("model_id", "label_id"))

class Label(db.Model):
    """
    This model holds information about a label
    """
    __tablename__ = "label"

    id = db.Column(db.Integer, primary_key=True)
    label_name = db.Column(db.String(128), nullable=False,)
    label_type = db.Column(db.String(80), nullable=False,)
    count = db.Column(db.Integer,
                   default = 0)
    project_id = db.Column(db.Integer, 
                        db.ForeignKey('project.id', ondelete="cascade", onupdate="cascade"),
                        nullable=False)
    labelsdata = db.relationship('LabelData', 
                                 backref='label',
                                 lazy=True,
                                 cascade="all, save-update, delete",
                                 passive_deletes=True)
    models = db.relationship("MLModel", 
                             secondary=model_has_label, 
                             backref=db.backref("labels", lazy="dynamic"))
    
    def __init__(self, label_name, label_type, project_id):
        """
        Initializes the label instance
        """
        self.label_name = label_name
        self.label_type = label_type
        self.project_id = project_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<Label %r>" % self.label_name
