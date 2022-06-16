import os

from api.extensions import db, ma
from api.serializers.comment import CommentSchema

comment_scheme = CommentSchema()
comments_scheme = CommentSchema(many =True)


def save(comment):
    """
    Save an comment to the database.
    This includes creating a new comment and editing one.
    """
    db.session.add(comment)
    db.session.commit()
    return comment_scheme.dump(comment).data