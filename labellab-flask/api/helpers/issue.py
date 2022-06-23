import os

from sqlalchemy import desc
from flask_sqlalchemy import Pagination

from api.extensions import db, ma
from api.models.Issue import Issue
from api.serializers.issue import IssueSchema
from api.config import config

allowed_priorities = config[os.getenv("FLASK_CONFIG") or "development"].ISSUE_PRIORITIES_ALLOWED
allowed_statuses = config[os.getenv("FLASK_CONFIG") or "development"].ISSUE_STATUSES_ALLOWED
allowed_entity_types = config[os.getenv("FLASK_CONFIG") or "development"].ENTITY_TYPES_ALLOWED

issue_schema = IssueSchema()
issues_schema = IssueSchema(many=True)

#List containing optional attributes
issue_attribute_validator = [
    {
        'key': 'due_date'
    },
    {
        'key': 'entity_type',
        'enum': allowed_entity_types
    },
    {
        'key': 'entity_id'
    },
    {
        'key': 'priority',
        'enum': allowed_priorities
    },
    {
        'key': 'status',
        'enum': allowed_statuses
    },
    {
        'key': 'team_id',
    },
]

def find_all_issues_by_project_id(project_id):
    """
    find all the issue in a project
    """
    issues = Issue.query.filter_by(project_id=project_id)
    return issues

def fetch_all_issue_by_category(project_id, category):
    """
    find all the issue in a project by category
    """
    issues = Issue.query.filter_by(project_id=project_id, category=category)
    return issues

def fetch_all_issue_by_entity_type(project_id,entity_type, entity_id):
    """
    find all the issue in a project by entity type and entity id
    """
    issues = Issue.query.filter_by(project_id=project_id, entity_type=entity_type,entity_id=entity_id)
    return issues

def fetch_all_issue_by_team_id(project_id, team_id):
    """
    find all the issue in a project by team ID.
    """
    issues = Issue.query.filter_by(project_id=project_id, team_id=team_id)
    return issues

def to_json(issue):
    """
    Returns an Issue JSON object
    """
    return issue_schema.dump(issue).data

def find_by_id(_id):
    """
    query issue on their id
    """
    issue = Issue.query.filter_by(id=_id).first()
    return issue_schema.dump(issue).data

def update_issue(issue_id, data):
    """
    update issue using its id.
    """
    issue = Issue.query.get(issue_id)
    for attribute in data:
        setattr(issue, attribute, data[attribute])
    db.session.commit()
    return issue_schema.dump(issue).data

def delete_by_id(_id):
    """
    Delete issue by their id
    """
    Issue.query.filter_by(id=_id).delete()
    db.session.commit()

def save(issue):
    """
    Save an issue to the database.
    This includes creating a new issue and editing one.
    """
    db.session.add(issue)
    db.session.commit()
    return issue_schema.dump(issue).data

def pagination(query, page, per_page):
    """
    Paginate issues queryset
    """
    paginated_query = query.order_by(desc(Issue.updated_at)).paginate(page, per_page, False)
    data = {
        "items": list(map(lambda issue: to_json(issue), paginated_query.items)),
        "total": paginated_query.total,
        "page": paginated_query.page,
        "per_page": paginated_query.per_page
    }
    return data
