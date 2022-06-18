from marshmallow import Schema, fields

from api.extensions import db, ma
from api.serializers.image import ImageSchema
from api.serializers.label import LabelSchema
from api.serializers.issue import IssueSchema

class ProjectSchema(ma.ModelSchema):
    """
    Serializer class for project
    """
        
    id = fields.Int(dump_only=True) 
    project_name = fields.Str()
    project_description = fields.Str()
    admin_id = fields.Int(dump_only=True)
    images = fields.Nested(ImageSchema, many=True)
    labels = fields.Nested(LabelSchema, many=True)
    issues = fields.Nested(IssueSchema, many=True)
