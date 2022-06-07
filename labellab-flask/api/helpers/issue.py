import os

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
        'key': 'statuses',
        'enum': allowed_statuses
    },
    {
        'key': 'team_id',
    },
]

def save(issue):
    """
    Save an issue to the database.
    This includes creating a new issue and editing one.
    """
    db.session.add(issue)
    db.session.commit()
    return issue_schema.dump(issue).data