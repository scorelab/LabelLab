from marshmallow import Schema, fields

from api.extensions import db, ma
from api.serializers.point import PointSchema

class LabelDataSchema(ma.ModelSchema):
    """
    Serializer class for labeldata
    """
        
    id = fields.Int(dump_only=True) 
    months_passed = fields.Int()
    image_id = fields.Int(dump_only=True)
    label_id = fields.Int(dump_only=True)
    points = fields.Nested(PointSchema, many=True)