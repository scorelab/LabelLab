from marshmallow import Schema, fields

from api.extensions import ma
from api.serializers.project import ProjectSchema
from api.serializers.projectmember import ProjectMemberSchema

class UserSchema(ma.ModelSchema):
    """
    Serializer class for user
    """
    
    id = fields.Int(dump_only=True)
    name = fields.Str() 
    username = fields.Str() 
    email = fields.Str() 
    thumbnail = fields.Str() 
    projects = fields.Nested(ProjectSchema, many=True)
    projectmembers = fields.Nested(ProjectMemberSchema, many=True)
    