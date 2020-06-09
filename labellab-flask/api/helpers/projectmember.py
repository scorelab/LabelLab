from api.extensions import db, ma
from api.models.ProjectMembers import ProjectMember
from api.serializers.projectmember import ProjectMemberSchema

projectmember_schema = ProjectMemberSchema()
projectmembers_schema = ProjectMemberSchema(many=True)

def to_json(projectmember):
    """
    Returns a ProjectMember JSON object
    """
    return projectmember_schema.dump(projectmember).data

def find_by_user_id(user_id):
    """
    query ProjectMember on their user id
    """
    projectmember = ProjectMember.query.filter_by(user_id=user_id).all()
    return projectmember_schema.dump(projectmember).data

def find_by_user_id_team_id(user_id, team_id):
    """
    query ProjectMember on their user id and team id
    """
    projectmember = ProjectMember.query.filter_by(user_id=user_id, team_id=team_id).first()
    return projectmember_schema.dump(projectmember).data

def find_all_by_team_id(team_id):
    """
    query ProjectMember on their team id.
    """
    projectmembers = ProjectMember.query.filter_by(team_id=team_id).all()
    return projectmembers_schema.dump(projectmembers).data

def find_all_by_user_id(user_id):
    """
    query ProjectMember on their user id.
    """
    projectmembers = ProjectMember.query.filter_by(user_id=user_id).all()
    return projectmembers_schema.dump(projectmembers).data

def count_users_in_team(team_id):
    """
    count projectmembers in a team
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

def save(ProjectMember):
    """
    Save a ProjectMember to the database.
    This includes creating a new ProjectMember and editing one.
    """
    db.session.add(ProjectMember)
    db.session.commit()
    return projectmember_schema.dump(ProjectMember).data