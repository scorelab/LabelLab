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

def find_by_teamname(teamname):
    """
    query team on their teamname
    """
    team = Team.query.filter_by(teamname=teamname).first()
    return team_schema.dump(team).data

def find_by_project_and_role(project_id, role):
    """
    query team on their project_id and role.
    """
    team = Team.query.filter_by(project_id=project_id, role=role).first()
    return team_schema.dump(team).data

def find_by_project_and_name(project_id, teamname):
    """
    query team on their project_id and teamname.
    """
    team = Team.query.filter_by(project_id=project_id, teamname=teamname).first()
    return team_schema.dump(team).data

def find_all(project_id):
    """
    query team on their project_id and teamname.
    """
    teams = Team.query.filter_by(project_id=project_id).all()
    return teams_schema.dump(teams).data

def delete_by_id(_id):
    """
    Delete team by their id
    """
    Team.query.filter_by(id=_id).delete()
    db.session.commit()
    
def delete_by_teamname(teamname):
    """
    Delete team by their teamname
    """
    Team.query.filter_by(teamname=teamname).delete()
    db.session.commit()

def delete_by_role(role):
    """
    Delete team by their role
    """
    Team.query.filter_by(role=role).delete()
    db.session.commit()

def save(team):
    """
    Save a team to the database.
    This includes creating a new team and editing one.
    """
    db.session.add(team)
    db.session.commit()
    return team_schema.dump(team).data