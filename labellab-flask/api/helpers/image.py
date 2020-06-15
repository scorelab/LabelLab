from api.extensions import db, ma
from api.models.Image import Image
from api.serializers.image import ImageSchema

image_schema = ImageSchema()
images_schema = ImageSchema(many=True)

def to_json(Image):
    """
    Returns a Image JSON object
    """
    return image_schema.dump(Image).data

def find_by_id(_id):
    """
    query Image on their id
    """
    image = Image.query.filter_by(id=_id).first()
    return image_schema.dump(image).data

def find_by_image_name(image_name):
    """
    query Image on their Imagename
    """
    image = Image.query.filter_by(image_name=image_name).first()
    return image_schema.dump(image).data

def delete_by_id(_id):
    """
    Delete Image by their id
    """
    Image.query.filter_by(id=_id).delete()
    db.session.commit()
    
def delete_by_image_name(image_name):
    """
    Delete Image by their name
    """
    Image.query.filter_by(image_name=image_name).delete()
    db.session.commit()

def save(image):
    """
    Save a Image to the database.
    This includes creating a new Image and editing one.
    """
    db.session.add(image)
    db.session.commit()
    return image_schema.dump(image).data