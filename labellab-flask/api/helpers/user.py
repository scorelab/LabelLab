from api.extensions import db, ma
from api.models.Projects import Project
from api.models.ProjectMembers import ProjectMember
from api.models.Team import Team
from api.models.User import User
from api.serializers.user import UserSchema
from api.serializers.project import ProjectSchema
from api.serializers.team import TeamSchema

user_schema = UserSchema()
users_schema = UserSchema(many=True)
project_schema = ProjectSchema()
team_schema = TeamSchema()

def to_json(user):
    """
    Returns a user JSON object
    """
    user_detail = user_schema.dump(user).data
    data = get_data(user_detail["id"])
    user_detail["all_teams"] = data["all_teams"]
    user_detail["all_projects"] = data["all_projects"]

    return user_detail

def find_by_email(email):
    """
    query user on their email
    """
    return User.query.filter_by(email=email).first()

def find_by_user_id(_id):
    """
    query user on their id
    """
    user = User.query.filter_by(id=_id).first()
    return user_schema.dump(user).data

def find_by_username(username):
    """
    query user on their username
    """
    user = User.query.filter_by(username=username).first()
    return user_schema.dump(user).data

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

def get_data(user_id):
    """
    get all the projects and the teams of a user
    """
    all_projects = []
    all_teams = []
    queries = db.session.query(
            User, ProjectMember, Team, Project
        ).join(
            ProjectMember, User.id == ProjectMember.user_id
        ).join(
            Team, ProjectMember.team_id == Team.id
        ).join(
            Project, Team.project_id == Project.id
        ).filter(
            User.id == user_id
        )
    for project in queries:
        all_projects.append(project_schema.dump(project.Project).data)
    
    for team in queries:
        all_teams.append(team_schema.dump(team.Team).data)
        
    return {"all_projects": all_projects,
            "all_teams": all_teams}

def get_user_roles(user_id, project_id):
    """
    get all the roles of a user in a project
    """
    all_roles = []
    queries = db.session.query(
            User, ProjectMember, Team, Project
        ).join(
            ProjectMember, User.id == ProjectMember.user_id
        ).join(
            Team, ProjectMember.team_id == Team.id
        ).join(
            Project, Team.project_id == Project.id
        ).filter(
            User.id == user_id,
            Project.id == project_id
        )
    for team in queries:
        all_roles.append(team_schema.dump(team.Team).data["role"])
    return all_roles

def get_teams_of_user_in_project(user_id, project_id):
    """
    get all the teams of the user in a project
    """
    all_team_ids = []
    queries = db.session.query(
            User, ProjectMember, Team, Project
        ).join(
            ProjectMember, User.id == ProjectMember.user_id
        ).join(
            Team, ProjectMember.team_id == Team.id
        ).join(
            Project, Team.project_id == Project.id
        ).filter(
            User.id == user_id,
            Project.id == project_id
        )
    for team in queries:
        all_team_ids.append(team_schema.dump(team.Team).data["id"])
        
    return all_team_ids

def get_projectmembers(project_id):
    """
    get the project members of a project
    """
    all_members = []
    queries = db.session.query(
           Project, Team, ProjectMember, User
        ).join(
            Team, Project.id == Team.project_id
        ).join(
            ProjectMember, Team.id == ProjectMember.team_id
        ).join(
            User, ProjectMember.user_id == User.id
        ).filter(
            Project.id == project_id
        )
    for member in queries:
        team_id = team_schema.dump(member.Team).data["id"]
        team_role = team_schema.dump(member.Team).data["role"]
        team_name = team_schema.dump(member.Team).data["team_name"]
        project_id = team_schema.dump(member.Team).data["project_id"]
        name = user_schema.dump(member.User).data["name"]
        email = user_schema.dump(member.User).data["email"]
        data = {
            "team_id": team_id,
            "team_role": team_role,
            "team_name": team_name,
            "project_id": project_id,
            "name": name,
            "email": email
        }
        all_members.append(data)
    return all_members

def save(user):
    """
    Save a user to the database.
    This includes creating a new user and editing one.
    """
    db.session.add(user)
    db.session.commit()
    user_detail = user_schema.dump(user).data
    data = get_data(user_detail["id"])
    user_detail["all_teams"] = data["all_teams"]
    user_detail["all_projects"] = data["all_projects"]

    return user_detail

def search_user(email_query):
    """
    search user on their email
    """
    search = "%{}%".format(email_query)
    users = User.query.filter(User.email.like(search)).all()
    return users_schema.dump(users).data