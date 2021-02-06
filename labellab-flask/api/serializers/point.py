from marshmallow import Schema, fields

from api.extensions import db, ma

class PointSchema(ma.ModelSchema):
    """
    Serializer class for Point
    """
        
    id = fields.Str(dump_only=True) 
    lng = fields.Float(attribute="y_coordinate")
    lat = fields.Float(attribute="x_coordinate")
    labeldata_id = fields.Str(dump_only=True)