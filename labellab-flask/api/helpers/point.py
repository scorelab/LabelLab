from api.extensions import db, ma
from api.models.Point import Point
from api.serializers.point import PointSchema

point_schema = PointSchema()
points_schema = PointSchema(many=True)

def to_json(point):
    """
    Returns a Point JSON object
    """
    return point_schema.dump(point).data

def find_by_id(_id):
    """
    query Point on their id
    """
    point = Point.query.filter_by(id=_id).first()
    return point_schema.dump(point).data

def find_by_labeldata_id(labeldata_id):
    """
    query Point on their labeldata_id
    """
    points = Point.query.filter_by(labeldata_id=labeldata_id).all()
    return points_schema.dump(points).data

def update_point(point_id, data):
    """
    update point using its id.
    """
    point = Point.query.get(point_id)
    point.x_coordinate = data['x_coordinate']
    point.y_coordinate = data['y_coordinate']
    db.session.commit()
    return point_schema.dump(point).data

def delete_by_id(_id):
    """
    Delete Point by their id
    """
    Point.query.filter_by(id=_id).delete()
    db.session.commit()
    
def delete_by_labeldata_id(labeldata_id):
    """
    Delete Point by their label data id.
    """
    Point.query.filter_by(labeldata_id=labeldata_id).delete()
    db.session.commit()

def save(Point):
    """
    Save a Point to the database.
    This includes creating a new Point and editing one.
    """
    db.session.add(Point)
    db.session.commit()
    return point_schema.dump(Point).data