from api.extensions import db, ma
from api.models.Issue import Issue
from api.serializers.issue import IssueSchema

issue_schema = IssueSchema()
issues_schema = IssueSchema(many=True)


def save(issue):
    """
    Save an issue to the database.
    This includes creating a new issue and editing one.
    """
    db.session.add(issue)
    db.session.commit()
    return issue_schema.dump(issue).data