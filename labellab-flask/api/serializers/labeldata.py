from marshmallow import Schema, fields, post_dump

from api.extensions import db, ma
from api.serializers.point import PointSchema

class LabelDataSchema(ma.ModelSchema):
    """
    Serializer class for labeldata
    """

    id = fields.Str(dump_only=True) 
    months_passed = fields.Int()
    image_id = fields.Int(dump_only=True)
    label_id = fields.Int(dump_only=True)
    points = fields.Nested(PointSchema, many=True)

    @post_dump(pass_many=True)
    def data(self, data, many, **kwargs):
        from api.helpers.label import get_label_type
        res_data = {}
        try:
            for i in range(len(data)):
                if res_data.get(data[i]['label_id']) is None:
                    res_data[data[i]['label_id']] = []
                label_type = get_label_type(data[i]['label_id'])
                data[i]['label_type'] = label_type
                res_data[data[i]['label_id']].append(data[i])
            return res_data
        except Exception as err:
            print(err)
