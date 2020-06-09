from api.extensions import db, ma
from api.models.Projects import Project
from api.serializers.project import ProjectSchema

project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)

def to_json(project):
    """
    Returns a project JSON object
    """
    return project_schema.dump(project).data

def find_by_project_id(_id):
    """
    query project on their id
    """
    project = Project.query.filter_by(id=_id).first()
    return project_schema.dump(project).data

def find_by_projectname(projectname):
    """
    query project on their projectname
    """
    project = Project.query.filter_by(projectname=projectname).first()
    return project_schema.dump(project).data

def delete_by_id(_id):
    """
    Delete project by their id
    """
    Project.query.filter_by(id=_id).delete()
    db.session.commit()
    
def delete_by_projectname(projectname):
    """
    Delete project by their name
    """
    Project.query.filter_by(projectname=projectname).delete()
    db.session.commit()

def save(project):
    """
    Save a project to the database.
    This includes creating a new project and editing one.
    """
    db.session.add(project)
    db.session.commit()
    return project_schema.dump(project).data