from marshmallow import Schema, fields

from api.extensions import db, ma


class ClassificationSchema(ma.ModelSchema):
    # Serializer for Classification

    id = fields.Int(dump_only=True)
    image_name = fields.Str()
    image_url = fields.Str()
    label = fields.Str()
    confidence = fields.Float()
    classifiedAt = fields.DateTime()
