from datetime import datetime
from flask import current_app, jsonify
from flask_bcrypt import Bcrypt
import json

from api.extensions import db, Base, ma

class User(db.Model):
    """
    This model holds information about a user registered
    """
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False,)
    password = db.Column(db.String(128))
    email = db.Column(db.String(100), nullable=False, unique=True)
    date = db.Column(db.DateTime, 
                  default=datetime.now())
    thumbnail = db.Column(db.String(1500), 
                       default='https://react.semantic-ui.com/images/avatar/large/elliot.jpg')
    projects = db.relationship('Project', 
                               backref='user', 
                               lazy=True,
                               cascade="all, save-update, delete",
                               passive_deletes=True)
    projectmembers = db.relationship('ProjectMember', 
                                      backref='user',
                                      lazy=True,
                                      cascade="all, save-update, delete",
                                      passive_deletes=True)

    def __init__(self, name, username, email, password):
        """
        Initializes the user instance
        """
        self.name = name
        self.username = username
        self.email = email
        if password:
            self.password = User.generate_password_hash(password)

    # def __repr__(self):
    #     """
    #     Returns the object reprensentation of user
    #     """
    #     return "<User %r>" % self.name

    @staticmethod
    def generate_password_hash(password):
        """
        Returns hash of password
        """
        return Bcrypt().generate_password_hash(password,10).decode()
    
    # @classmethod
    # def delete_by_id(cls, id):
    #     cls.query.filter_by(id=id).delete()
    #     db.session.commit()

    def verify_password(self, password):
        """
        Verify the password
        """
        return Bcrypt().check_password_hash(self.password, password)
