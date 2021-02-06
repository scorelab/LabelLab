from marshmallow import Schema, fields

from api.extensions import ma

class ProjectMemberSchema(ma.ModelSchema):
    """
    Serializer class for projectmember
    """
        
    user_id = fields.Int(dump_only=True)
    team_id = fields.Int(dump_only=True)
    