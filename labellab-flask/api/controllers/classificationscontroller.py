from flask.views import MethodView
from flask import request, make_response, jsonify, current_app
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_raw_jwt)
from datetime import datetime

from api.helpers.classification import (
    get_classified_data, find_by_id, find_all_by_id, save_image, save_to_db, delete_by_id)
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
                confidence=_current[1],
                user_id=current_user
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


class ClassificationInfo(MethodView):
    # This class returns a single classification data

    @jwt_required
    def get(self, classification_id):
        try:
            if not classification_id:
                response = {
                    "success": False,
                    "msg": "Classification id not found"
                }
                return make_response(jsonify(response)), 400

            classification = find_by_id(classification_id)
            response = {
                "success": True,
                "msg": "Classification found",
                "body": classification
            }
            return make_response(jsonify(response)), 200

        except Exception as err:
            response = {
                "success": False,
                "msg": "Error while fetching classification"
            }
            return make_response(jsonify(response)), 500


class GetAllClassifications(MethodView):
    # This class returns all classifications by user id

    @jwt_required
    def get(self):
        current_user = get_jwt_identity()

        try:
            classifications = find_all_by_id(current_user)

            response = {
                "success": True,
                "msg": "Classifications found",
                "body": classifications
            }
            return make_response(jsonify(response)), 200

        except Exception as err:
            response = {
                "success": False,
                "msg": "Error while fetching classifications"
            }
            return make_response(jsonify(response)), 500

class DeleteClassification(MethodView):
    # This class deletes a classification using its id

    @jwt_required
    def delete(self, classification_id):

        if not classification_id:
            response = {
                "success": False,
                "msg": "Classification id not found"
            }
            return make_response(jsonify(response)), 400

        current_user_id = get_jwt_identity()

        classification = find_by_id(classification_id)

        # Check if a classification with that id exists or not
        if not classification:
            response = {
                "success": False,
                "msg": "Classification not found"
            }
            return make_response(jsonify(response)), 404

        if classification["user_id"] != current_user_id:
            # The user making this request is not the one who created this classification
            # So we cannot let him delete it
            response = {
                "success": False,
                "msg": "Can only delete classifications you created"
            }
            return make_response(jsonify(response)), 401

        try:
            delete_by_id(classification_id)

            response = {
                "success":True,
                "msg": "Classification deleted successfully"
            }
            return make_response(jsonify(response)), 200

        except Exception as err:
            
            response = {
                "success": False,
                "msg": "Error deleting classification"
            }
            return make_response(jsonify(response)), 500


classificationController = {
    "classify_image": ClassifyImage.as_view("classify_image"),
    "get_classification": ClassificationInfo.as_view("get_classification"),
    "get_all_classifications": GetAllClassifications.as_view("get_all_classifications"),
    "delete_classification": DeleteClassification.as_view("delete_classification")
}
