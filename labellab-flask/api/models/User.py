from datetime import datetime
from flask import current_app
from flask_bcrypt import Bcrypt

from api.extensions import db, Base

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
                               cascade="all, delete-orphan")
    projectmembers = db.relationship('PojectMember', 
                                      backref='user',
                                      lazy=True,
                                      cascade="all, delete-orphan")

    def __init__(self, name, username, email, password):
        """
        Initializes the user instance
        """
        self.name = name
        self.username = username
        self.email = email
        if password:
            self.password = User.generate_password_hash(password)

    def __repr__(self):
        """
        Returns the object reprensentation of user
        """
        return "<User %r>" % self.name
    
    def to_json(self):
        """
        Returns a JSON object
        """
        user_json = {"name": self.name, "email": self.email, "username": self.username}
        return user_json

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_user_id(cls, _id):
        return cls.query.filter_by(id=_id).first()
    
    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @staticmethod
    def generate_password_hash(password):
        """
        Returns hash of password
        """
        return Bcrypt().generate_password_hash(password,10).decode()

    def verify_password(self, password):
        """
        Verify the password
        """
        return Bcrypt().check_password_hash(self.password, password)

    def save(self):
        """
        Save a user to the database.
        This includes creating a new user and editing one.
        """
        db.session.add(self)
        db.session.commit()