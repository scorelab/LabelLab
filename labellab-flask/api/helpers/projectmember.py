from api.extensions import db, ma
from api.models.ProjectMembers import ProjectMember
from api.serializers.projectmember import ProjectMemberSchema

project_member_schema = ProjectMemberSchema()
project_members_schema = ProjectMemberSchema(many=True)

def to_json(project_member):
    """
    Returns a ProjectMember JSON object
    """
    return project_member_schema.dump(project_member).data

def find_by_user_id(user_id):
    """
    query ProjectMember on their user id
    """
    project_member = ProjectMember.query.filter_by(user_id=user_id).all()
    return project_member_schema.dump(project_member).data

def find_by_user_id_team_id(user_id, team_id):
    """
    query ProjectMember on their user id and team id
    """
    project_member = ProjectMember.query.filter_by(user_id=user_id, team_id=team_id).first()
    return project_member_schema.dump(project_member).data

def find_all_by_team_id(team_id):
    """
    query ProjectMember on their team id.
    """
    project_members = ProjectMember.query.filter_by(team_id=team_id).all()
    return project_members_schema.dump(project_members).data

def find_all_by_user_id(user_id):
    """
    query ProjectMember on their user id.
    """
    project_members = ProjectMember.query.filter_by(user_id=user_id).all()
    return project_members_schema.dump(project_members).data

def count_users_in_team(team_id):
    """
    count project_members in a team
    """
    project_members = ProjectMember.query.filter_by(team_id=team_id).count()
    return project_members

def delete_by_id(_id):
    """
    Delete ProjectMember by their id
    """
    ProjectMember.query.filter_by(id=_id).delete()
    db.session.commit()
    
def delete_by_user_id(user_id):
    """
    Delete ProjectMember by their user_id
    """
    ProjectMember.query.filter_by(user_id=user_id).delete()
    db.session.commit()

def delete_by_user_id_team_id(user_id, team_id):
    """
    Delete ProjectMember by their user_id and team_id
    """
    ProjectMember.query.filter_by(user_id=user_id, team_id=team_id).delete()
    db.session.commit()

def save(project_member):
    """
    Save a ProjectMember to the database.
    This includes creating a new ProjectMember and editing one.
    """
    db.session.add(project_member)
    db.session.commit()
    return project_member_schema.dump(project_member).data