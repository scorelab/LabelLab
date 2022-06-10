from cProfile import label
import os

from sqlalchemy import desc
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
    issues = Issue.query.filter_by(project_id=project_id).all()
    return issues_schema.dump(issues).data

def fetch_all_issue_by_category(project_id, category):
    issues = Issue.query.filter_by(project_id=project_id, category=category).all()
    return list(map(lambda issue: to_json(issue), issues))

def fetch_all_issue_by_entity_type(project_id,entity_type, entity_id):
    issues = Issue.query.filter_by(project_id=project_id, entity_type=entity_type,entity_id=entity_id).all()
    return list(map(lambda issue: to_json(issue), issues))


def save(issue):
    """
    Save an issue to the database.
    This includes creating a new issue and editing one.
    """
    db.session.add(issue)
    db.session.commit()
    return issue_schema.dump(issue).data

def to_json(issue):
    return issue_schema.dump(issue).data