from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import jwt_required
import pandas as pd
import json
import os

from api.config import config
from api.models.MLModel import MLModel, optional_params
from api.models.Projects import Project
from api.models.Label import Label
from api.models.LabelData import LabelData
from utils.classifier import Classifier

class Train(MethodView):
    """
    This method trains a saved model
    """

    @jwt_required
    def post(self):
        """Handle POST request for this view. Url --> /api/models/train"""

        # getting JSON data from request
        post_data = request.get_json(silent=True, force=True)

        try:
            model_id = post_data["id"]

        except Exception as err:
            response = {"message": "Please provide all the required fields."}
            return make_response(jsonify(response)), 404

        model = MLModel.find_by_id(model_id)

        if model:

            image_df = pd.DataFrame(columns=["imagename", "label"])

            """Create the classifier for training and save the model with updated saved model."""
            try:
                # TODO: Refactor after label and image controllers are added
                # Go through each model label
                for label_id in model.label_ids:
                    label = Label.find_by_id_in_project(label_id, model.project_id)
                    # Go through each image associated with label
                    for image in LabelData.find_by_label_id(label.id):
                        # Add image to pandas dataframe
                        image_df.append({"imagename": image.image_name,
                                        "label": label.label_name
                                        }, ignore_index=True)

                # Create model
                cl = Classifier()

                # Set hyperparameters
                cl.set_learning_rate(model.learning_rate)
                cl.set_optimizer(model.optimizer)
                cl.set_loss(model.loss)
                cl.set_metrics(model.metric)
                cl.set_batch_size(model.batch_size)
                cl.set_epochs(model.epochs)

                with open(model.preprocessing_steps_json_url) as f:
                    preprocessing_data = json.load(f)

                # Add image preprocessing
                cl.add_preprocessing_steps(preprocessing_data, model.validation)

                # Load the data
                parent_dir = config['development'].UPLOAD_FOLDER
                path = os.path.join(parent_dir, model.project_id)
                cl.load_data(data=image_df, directory=path, test_split=model.test)

                # Set the layers
                if model.source == "transfer":
                    cl.set_transfer_source(model.transfer_source)
                elif model.source == "upload":
                    pass

                with open(model.layers_json_url) as f:
                    layers_data = json.load(f)

                cl.add_layers(layers_data)

                # Compile
                cl.compile()

                # Fit
                cl.fit()

                # Save the model
                saved_model_url = f"./api/static/models/{model.project_id}_{model.id}/"
                cl.save(saved_model_url)
                model.set_saved_model_url(saved_model_url)
                model.save()
            except Exception as err:
                print("Error occurred: ", err)
                response = {"message": "Something went wrong while training!!"}
                return make_response(jsonify(response)), 500

            response = {
                "message": "Model trained successfully!"}

            # return a response notifying the user that they saved the model
            # successfully
            return make_response(jsonify(response)), 201
        else:
            # There is no model with the given id.
            response = {
                "message": "Model with given id does not exist. Please try again."}
            return make_response(jsonify(response)), 401



class Save(MethodView):
    """
    This method saved the details of the model
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
    "train": Train.as_view("train")
}
