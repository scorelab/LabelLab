from marshmallow import Schema, fields

from api.extensions import db, ma

class CommentSchema(ma.ModelSchema):
    """
    Serializer class for Comments
    """

    id = fields.Int(dump_only=True)
    body = fields.Str()
    issue_id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    username=fields.Str(dump_only=True)
    thumbnail = fields.Str()
    timestamp = fields.DateTime(format='%Y-%m-%d %H:%M:%S', dump_only=True)

