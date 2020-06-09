from marshmallow import Schema, fields

from api.extensions import db, ma
from api.serializers.labeldata import LabelDataSchema

class LabelSchema(ma.ModelSchema):
    """
    Serializer class for label
    """
        
    id = fields.Int(dump_only=True) 
    labelname = fields.Str()
    label_type = fields.Str()
    count = fields.Int()
    project_id = fields.Int(dump_only=True)
    labelsdata = fields.Nested(LabelDataSchema, many=True)
    