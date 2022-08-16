from marshmallow import Schema, fields

from api.extensions import db, ma

class NotificationSchema(ma.ModelSchema):
    """
    Serializer class for Notifications
    """
    id = fields.Int(dump_only=True)
    message = fields.Str()
    type = fields.Str()
    user_id = fields.Int(dump_only=True)
