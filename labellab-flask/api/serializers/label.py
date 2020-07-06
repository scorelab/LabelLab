from marshmallow import Schema, fields

from api.extensions import db, ma
from api.serializers.labeldata import LabelDataSchema

class LabelSchema(ma.ModelSchema):
    """
    Serializer class for label
    """
        
    id = fields.Int(dump_only=True) 
    label_name = fields.Str()
    label_type = fields.Str()
    count = fields.Int()
    project_id = fields.Int(dump_only=True)
    created_at = fields.DateTime(format='%Y-%m-%d %H:%M:%S', dump_only=True)
    labeldata = fields.Nested(LabelDataSchema, many=True)
    