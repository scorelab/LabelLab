from marshmallow import Schema, fields

from api.extensions import db, ma

class IssueSchema(ma.ModelSchema):
    """
    Serializer class for issue
    """
        
    id = fields.Int(dump_only=True)
    title = fields.Str()
    description = fields.Str()
    project_id = fields.Int(dump_only=True)
    created_by = fields.Int(dump_only=True)
    assignee_id = fields.Int()
    team_id = fields.Int()
    category = fields.Str()
    priority = fields.Str()
    status = fields.Str()
    entity_type = fields.Str()
    entity_id = fields.Int()
    due_date = fields.DateTime(format='%Y-%m-%d %H:%M:%S')
    created_at = fields.DateTime(format='%Y-%m-%d %H:%M:%S', dump_only=True)
    updated_at = fields.DateTime(format='%Y-%m-%d %H:%M:%S')
    