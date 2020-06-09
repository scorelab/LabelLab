from marshmallow import Schema, fields

from api.extensions import db, ma
from api.serializers.projectmember import ProjectMemberSchema

class TeamSchema(ma.ModelSchema):
    """
    Serializer class for team
    """
        
    id = fields.Int(dump_only=True) 
    teamname = fields.Str()
    role = fields.Str()
    project_id = fields.Int(dump_only=True)
    team_members = fields.Nested(ProjectMemberSchema, many=True)