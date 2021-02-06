from marshmallow import Schema, fields

from api.extensions import db, ma
from api.serializers.labeldata import LabelDataSchema

class ImageSchema(ma.ModelSchema):
    """
    Serializer class for image
    """
        
    id = fields.Int(dump_only=True) 
    image_name = fields.Str()
    image_url = fields.Str()
    height = fields.Int()
    width = fields.Int()
    labelled = fields.Bool()
    project_id = fields.Int(dump_only=True)
    labeldata = fields.Nested(LabelDataSchema, many=True)