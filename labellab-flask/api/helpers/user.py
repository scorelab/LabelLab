from api.extensions import db, ma
from api.models.Projects import Project
from api.models.ProjectMembers import ProjectMember
from api.models.Team import Team
from api.models.User import User
from api.serializers.user import UserSchema
from api.serializers.project import ProjectSchema

user_schema = UserSchema()
users_schema = UserSchema(many=True)
projects_schema = ProjectSchema(many=True)

def to_json(user):
    """
    Returns a user JSON object
    """
    return user_schema.dump(user).data

def find_by_email(email):
    """
    query user on their email
    """
    return User.query.filter_by(email=email).first()

def find_by_user_id(_id):
    """
    query user on their id
    """
    return User.query.filter_by(id=_id).first()

def find_by_username(username):
    """
    query user on their username
    """
    return User.query.filter_by(username=username).first()

def delete_by_id(_id):
    """
    Delete user by their id
    """
    User.query.filter_by(id=_id).delete()
    db.session.commit()
    
def delete_by_email(email):
    """
    Delete user by their email
    """
    User.query.filter_by(email=email).delete()
    db.session.commit()

def save(user):
    """
    Save a user to the database.
    This includes creating a new user and editing one.
    """
    db.session.add(user)
    db.session.commit()
    return user_schema.dump(user).data