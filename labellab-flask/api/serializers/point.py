from marshmallow import Schema, fields

from api.extensions import db, ma

class PointSchema(ma.ModelSchema):
    """
    Serializer class for Point
    """
        
    id = fields.Int(dump_only=True) 
    y_coordinate = fields.Float()
    x_coordinate = fields.Float()
    labeldata_id = fields.Int(dump_only=True)