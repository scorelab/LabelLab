from api.extensions import db, ma
from api.models.Team import Team
from api.serializers.team import TeamSchema

team_schema = TeamSchema()
teams_schema = TeamSchema(many=True)

def to_json(team):
    """
    Returns a team JSON object
    """
    return team_schema.dump(team).data

def find_by_id(_id):
    """
    query team on their id
    """
    team = Team.query.filter_by(id=_id).first()
    return team_schema.dump(team).data

def find_by_team_name(team_name):
    """
    query team on their team_name
    """
    team = Team.query.filter_by(team_name=team_name).first()
    return team_schema.dump(team).data

def find_by_project_and_role(project_id, role):
    """
    query team on their project_id and role.
    """
    team = Team.query.filter_by(project_id=project_id, role=role).first()
    return team_schema.dump(team).data

def find_by_project_and_name(project_id, team_name):
    """
    query team on their project_id and team_name.
    """
    team = Team.query.filter_by(project_id=project_id, team_name=team_name).first()
    return team_schema.dump(team).data

def find_all(project_id):
    """
    query team on their project_id and team_name.
    """
    teams = Team.query.filter_by(project_id=project_id).all()
    return teams_schema.dump(teams).data

def update_team(team_id, data):
    """
    update team using its id.
    """
    team = Team.query.get(team_id)
    team.team_name = data['team_name']
    team.role = data['role']
    db.session.commit()
    return team_schema.dump(team).data

def delete_by_id(_id):
    """
    Delete team by their id
    """
    Team.query.filter_by(id=_id).delete()
    db.session.commit()
    
def delete_by_team_name(team_name):
    """
    Delete team by their team_name
    """
    Team.query.filter_by(team_name=team_name).delete()
    db.session.commit()

def delete_by_role(role):
    """
    Delete team by their role
    """
    Team.query.filter_by(role=role).delete()
    db.session.commit()

def find_admin_team_of_project(project_id):
    team = Team.query.filter_by(project_id=project_id, role='admin').first()
    return team_schema.dump(team).data

def save(team):
    """
    Save a team to the database.
    This includes creating a new team and editing one.
    """
    db.session.add(team)
    db.session.commit()
    return team_schema.dump(team).data