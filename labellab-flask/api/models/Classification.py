from flask import current_app
from datetime import datetime

from api.extensions import db, Base


class Classification(db.Model):
    # This model holds information about classification requests by a user

    __tablename__ = "classification"

    id = db.Column(db.Integer, primary_key=True)
    image_name = db.Column(db.String(255), nullable=False,)
    image_url = db.Column(db.String(255), nullable=False,)
    label = db.Column(db.String(255))
    confidence = db.Column(db.Float)
    user_id = db.Column(db.Integer,
                        db.ForeignKey(
                            'user.id', ondelete="cascade", onupdate="cascade"),
                        nullable=False)
    classified_at = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, image_name, image_url, label, confidence, user_id):
        self.image_name = image_name
        self.image_url = image_url
        self.label = label
        self.confidence = confidence
        self.user_id = user_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<Classification %r>" % self.image_name
