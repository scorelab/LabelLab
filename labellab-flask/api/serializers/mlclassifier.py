from marshmallow import Schema, fields

from api.extensions import db, ma
from api.serializers.label import LabelSchema

class MLClassifierSchema(ma.ModelSchema):
    """
    Serializer class for ML Classifier
    """
        
    id = fields.Int(dump_only=True)
    name = fields.Str()
    type = fields.Str()
    source = fields.Str()
    preprocessing_steps_json_url = fields.Str()
    layers_json_url = fields.Str()
    train = fields.Float()
    test = fields.Float()
    validation = fields.Float()
    epochs = fields.Int()
    batch_size = fields.Int()
    learning_rate = fields.Float()
    loss = fields.Str()
    optimizer = fields.Str()
    metric = fields.Str()
    loss_graph_url = fields.Str()
    accuracy_graph_url = fields.Str()
    saved_model_url = fields.Str()
    transfer_source = fields.Str()
    project_id = fields.Int(dump_only=True)
    labels = fields.Nested(LabelSchema, many=True)