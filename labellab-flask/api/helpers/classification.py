import os
import sys
import base64
from io import BytesIO

from api.config import config
from api.extensions import db, ma
from api.serializers.classification import ClassificationSchema

classification_schema = ClassificationSchema()


def get_classified_data():
    return ["test-label", 92.1774]


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
