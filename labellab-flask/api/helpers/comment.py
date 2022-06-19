import os

from api.extensions import db, ma
from api.models.Comment import Comment
from api.serializers.comment import CommentSchema

comment_schema = CommentSchema()
comments_schema = CommentSchema(many =True)

# Fetch comments of an issue
def fetch_comments_by_issue_id(issue_id):
    comments = Comment.query.filter_by(issue_id=issue_id).all()
    return list(map(lambda comment: to_json(comment), comments))

def find_all_comments_by_issue_id(issue_id):
    """
    find all the comments in a issue
    """
    issues = Comment.query.filter_by(issue_id=issue_id).all()
    return comments_schema.dump(issues).data

def to_json(comment):
    """
    Returns a Comment JSON object
    """
    return comment_schema.dump(comment).data

def find_by_id(_id):
    """
    query comment on their id
    """
    comment = Comment.query.filter_by(id=_id).first()
    return comment_schema.dump(comment).data

def update_comment(comment_id, data):
    """
    update comment using its id.
    """
    comment = Comment.query.get(comment_id)
    for attribute in data:
        setattr(comment, attribute, data[attribute])
    db.session.commit()
    return comment_schema.dump(comment).data

def delete_by_id(_id):
    """
    Delete comment by their id
    """
    Comment.query.filter_by(id=_id).delete()
    db.session.commit()
def save(comment):
    """
    Save an comment to the database.
    This includes creating a new comment and editing one.
    """
    db.session.add(comment)
    db.session.commit()
    return comment_schema.dump(comment).data