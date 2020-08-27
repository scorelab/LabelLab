from flask.views import MethodView
from flask import request, make_response, jsonify, current_app
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_raw_jwt)
from datetime import datetime

from api.helpers.classification import (
    get_classified_data, save_image, save_to_db)
from api.models.Classification import Classification


class ClassifyImage(MethodView):
    # This class handles image upload and return classification data

    @jwt_required
    def post(self):
        current_user = get_jwt_identity()

        try:
            image = request.files.getlist("image")[0]

        except Exception as ex:
            response = {
                "success": False,
                "msg": "Missing image"
            }
            return make_response(jsonify(response)), 400

        try:
            image_name = image.filename.split('.')[0]
            ext = image.filename.split('.')[1]
            timestamp = datetime.timestamp(datetime.now())
            image_url = f"{current_user}_{image_name}_{timestamp}.{ext}"
            save_image(current_user, image, image_url)

            # Mock classification data
            _current = get_classified_data()

            to_save = Classification(
                image_name=image_name,
                image_url=image_url,
                label=_current[0],
                confidence=_current[1]
            )
            classification_schema = save_to_db(to_save)

            response = {
                "success": True,
                "msg": "Image labelled successfully",
                "body": classification_schema
            }
            return make_response(jsonify(response)), 200

        except Exception as err:
            response = {
                "success": False,
                "msg": "Error while saving image"
            }
            return make_response(jsonify(response)), 500


classificationController = {
    "classify_image": ClassifyImage.as_view("classify_image")
}
