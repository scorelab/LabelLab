from datetime import datetime
from flask import current_app

from api.extensions import db, Base

class RevokedToken(db.Model):
    """
    This model holds information about revoked tokens, users who have logged out
    """

    __tablename__ = "revoked_token"
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120))

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti=jti).first()
        return bool(query)