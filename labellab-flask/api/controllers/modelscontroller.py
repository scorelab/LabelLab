from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import jwt_required

from api.models.MLModel import MLModel, optional_params
from api.models.Projects import Project

class Save(MethodView):
    """
    This method removes the access token on logout and stores the revoked token.
    """

    @jwt_required
    def post(self):
        """Handle POST request for this view. Url --> /api/models/save"""
        # getting JSON data from request
        post_data = request.get_json(silent=True, force=True)

        model_data = {}

        try:
            model_data["name"] = post_data["name"]
            model_data["type"] = post_data["type"]
            model_data["source"] = post_data["source"]
            model_data["project_id"] = Project.find_by_id(post_data["projectId"])

            # Add the optional params if the request contains them
            for param in optional_params:
                if param in post_data:
                    model_data[param] = post_data[param]

        except Exception as err:
            response = {"message": "Please provide all the required fields."}
            return make_response(jsonify(response)), 404

        if "id" in post_data:
            # Querying the database with requested id
            model = MLModel.find_by_id(model_data["id"])

            if model:
                # Save changes to the model
                """Save the new MLModel."""
                try:
                    model = MLModel(model_data)
                    model.save()
                except Exception as err:
                    print("Error occurred: ", err)
                    response = {"message": "Something went wrong while editing!!"}
                    return make_response(jsonify(response)), 500

                response = {
                    "model": model.to_json()}

                # return a response notifying the user that they saved the model
                # successfully
                return make_response(jsonify(response)), 201
            else:
                # There is no model with the given id.
                response = {
                    "message": "Model with given id does not exist. Please try again."}
                return make_response(jsonify(response)), 401

        else:
            """Create a new model."""
            try:
                model = MLModel(model_data)
                model.save()
            except Exception as err:
                print("Error occurred: ", err)
                response = {"message": "Something went wrong while creating!!"}
                return make_response(jsonify(response)), 500

            response = {"model": model.to_json()}

            # return a response notifying the user that they created a new model
            # successfully
            return make_response(jsonify(response)), 201


modelController = {
    "save": Save.as_view("save"),
}
