from marshmallow import Schema, fields

from api.extensions import db, ma

class ProjectSchema(ma.ModelSchema):
    """
    Serializer class for project
    """
        
    id = fields.Int(dump_only=True) 
    projectname = fields.Str()
    projectdescription = fields.Str()
    admin_id = fields.Int(dump_only=True)