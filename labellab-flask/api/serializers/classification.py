from marshmallow import Schema, fields

from api.extensions import db, ma


class ClassificationSchema(ma.ModelSchema):
    # Serializer for Classification

    id = fields.Int(dump_only=True)
    image_name = fields.Str()
    image_url = fields.Str()
    label = fields.Str()
    confidence = fields.Float()
    user_id = fields.Int(dump_only=True)
    classified_at = fields.DateTime()
