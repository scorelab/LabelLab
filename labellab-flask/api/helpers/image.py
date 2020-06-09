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

def find_by_imagename(imagename):
    """
    query Image on their Imagename
    """
    image = Image.query.filter_by(imagename=imagename).first()
    return image_schema.dump(image).data

def delete_by_id(_id):
    """
    Delete Image by their id
    """
    Image.query.filter_by(id=_id).delete()
    db.session.commit()
    
def delete_by_imagename(imagename):
    """
    Delete Image by their name
    """
    Image.query.filter_by(imagename=imagename).delete()
    db.session.commit()

def save(Image):
    """
    Save a Image to the database.
    This includes creating a new Image and editing one.
    """
    db.session.add(Image)
    db.session.commit()
    return image_schema.dump(Image).data