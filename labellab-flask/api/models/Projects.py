from datetime import datetime
from flask import current_app

from api.extensions import db, Base


class Project(db.Model):
    """
    This model holds information about a project and its admin
    """
    __tablename__ = "project"

    id = db.Column(db.Integer, primary_key=True)
    projectname = db.Column(db.String(80), nullable=False,)
    projectdescription = db.Column(db.String(128),
                                   default='Image labelling')
    admin_id = db.Column(db.Integer,
                         db.ForeignKey('user.id'),
                         nullable=False)
    labels = db.relationship('Label',
                             backref='project',
                             lazy=True,
                             cascade="all, delete-orphan")
    images = db.relationship('Image',
                             backref='project',
                             lazy=True,
                             cascade="all, delete-orphan")
    models = db.relationship('MLModel',
                             backref='project',
                             lazy=True,
                             cascade="all, delete-orphan")

    def __init__(self, projectname, projectdescription, admin_id):
        """
        Initializes the project instance
        """
        self.projectname = projectname
        self.projectdescription = projectdescription
        self.admin_id = admin_id

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<Project %r>" % self.projectname

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()
