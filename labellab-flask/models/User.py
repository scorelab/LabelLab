from datetime import datetime
from flask import current_app

from ..database import db, Column, Model
from ..extensions import Base

class User(Model):
    """
    This model holds information about a user registered
    """
    __tablename__ = "user"

    id = Column(db.Integer, primary_key=True)
    name = Column(db.String(80), nullable=False)
    username = Column(db.String(80), unique=True, nullable=False,)
    password = Column(db.String(128))
    email = Column(db.String(100), nullable=False, unique=True)
    date = Column(db.DateTime, 
                  default=datetime.now())
    thumbnail = Column(db.String(1500), 
                       default='https://react.semantic-ui.com/images/avatar/large/elliot.jpg')
    projects = db.relationship('project', 
                               backref='user', 
                               lazy=True,
                               cascade="all, delete-orphan")
    projectmembers = db.relationship('projectmember', 
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
        self.password = password

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<User %r>" % self.name