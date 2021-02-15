import os
import sys
import base64
import random
from io import BytesIO

from api.config import config
from api.extensions import db, ma
from api.models.Classification import Classification
from api.serializers.classification import ClassificationSchema

classification_schema = ClassificationSchema()
classifications_schema = ClassificationSchema(many=True)


def find_by_id(id):
    classification = Classification.query.filter_by(id=id).first()
    return classification_schema.dump(classification).data

def delete_by_id(id):
    """
    Delete classification by id
    """
    Classification.query.filter_by(id=id).delete()
    db.session.commit()


def find_all_by_id(user_id):
    classifications = Classification.query.filter_by(user_id=user_id).all()
    return classifications_schema.dump(classifications).data


def get_classified_data():
    return ["test-label", round(random.uniform(80, 95), 4)]


def save_image(username, image, image_url):
    # Save image to the uploads folder

    parent_dir = config[os.getenv("FLASK_CONFIG")
                        or "development"].UPLOAD_FOLDER
    dir_path = os.path.join(os.path.join(
        parent_dir, "classifications"), f"{username}")

    try:
        os.makedirs(dir_path, exist_ok=True)
    except OSError as err:
        return f"Error occured: {err}"

    path = os.path.join(dir_path, f"{image_url}")

    try:
        image.save(path)
    except Exception as err:
        return f"Error occured: {err}"


def save_to_db(classification):
    db.session.add(classification)
    db.session.commit()
    return classification_schema.dump(classification).data
