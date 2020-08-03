from flask.views import MethodView
from flask import make_response, request, jsonify, current_app, send_from_directory, send_file
from flask_jwt_extended import jwt_required
import pandas as pd
import json
import os
import zipfile

from api.config import config
from api.models.MLClassifier import MLClassifier, optional_params
from api.models.Label import Label
from api.models.LabelData import LabelData
from api.models.Image import Image
from ml.classifier import Classifier, save_uploaded_model

from api.helpers.project import find_by_project_id as find_project
from api.helpers.mlclassifier import (
    save as save_ml_classifier,
    update as update_ml_classifier,
    delete_by_id as delete_ml_classifier,
    find_by_id as find_ml_classifier,
    find_all_by_project_id as find_ml_classifiers
)

ml_files_dir = config["development"].ML_FILES_DIR

class CreateMLClassifier(MethodView):
    """This class creates a new classifier model."""
    @jwt_required
    def post(self):
        """
        Handle POST request for this view.
        Url --> /api/v1/mlclassifier
        """
        # getting JSON data from request
        post_data = request.get_json(silent=True, force=True)

        try:
            model_data = {}
            model_data["name"] = post_data["name"]
            model_data["type"] = post_data["type"]
            model_data["source"] = post_data["source"]
            model_data["project_id"] = find_project(post_data["projectId"])

        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        project_id = post_data["projectId"]

        if not project_id:
            response = {
                "success": False,
                "msg": "Project ID is not provided."
            }
            return make_response(jsonify(response)), 400

        # Saving the classifier model to the database
        try:
            # Save model with necessary fields 
            ml_classifier = MLClassifier({
                "name": model_data["name"],
                "type": model_data["type"],
                "source": model_data["source"],
                "project_id": model_data["project_id"],
            })
            saved_ml_classifier = save_ml_classifier(ml_classifier)

            response = {
                "success": True,
                "msg": "Model saved to the server.",
                "body": saved_ml_classifier
            }
            return make_response(jsonify(response)), 201

        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Could not save model to the server."
            }
            return make_response(jsonify(response)), 500


class MLClassifierInfo(MethodView):
    """This class updates changes to an existing classifier model."""
    """
    This methods gets, deletes and updates the info of a particular MLClassifier.
    Handle GET, DELETE, PUT request for this view. 
    Url --> /api/v1/mlclassifier/<int:mlclassifier_id>
    """
    @jwt_required
    def get(self, mlclassifier_id):
        try:
            if not mlclassifier_id:
                response = {
                    "success":False,
                    "msg": "Model ID not provided"
                }
                return make_response(jsonify(response)), 400
            
            ml_classifier = find_ml_classifier(mlclassifier_id)
            response = {
                "success": True,
                "msg": "Model found",
                "body": ml_classifier
            }
            return make_response(jsonify(response)), 200
        
        except Exception:
            response = {
                "success":False,
                "msg": "Something went wrong!"
                }
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500

    @jwt_required
    def delete(self, mlclassifier_id):
        try:
            if not mlclassifier_id:
                response = {
                    "success":False,
                    "msg": "Model ID not provided"
                    }
                return make_response(jsonify(response)), 500
            
            delete_ml_classifier(mlclassifier_id)
            response = {
                "success": True,
                "msg": "Model deleted."
            }
            return make_response(jsonify(response)), 200
        
        except Exception:
            response = {
                "success":False,
                "msg": "Something went wrong!"
                }
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500

    @jwt_required
    def put(self, mlclassifier_id):
        # getting JSON data from request
        post_data = request.get_json(silent=True, force=True)

        try:
            model_data = {}
            model_data["id"] = mlclassifier_id
            model_data["name"] = post_data["name"]
            model_data["type"] = post_data["type"]
            model_data["source"] = post_data["source"]

            # Add the optional params if the request contains them
            for param in optional_params:
                if param in post_data:
                    model_data[param] = post_data[param]

        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        # Saving the classifier model to the database
        try:
            saved_ml_classifier = update_ml_classifier(model_data)

            response = {
                "success": True,
                "msg": "Changes saved to the server.",
                "body": saved_ml_classifier
            }
            return make_response(jsonify(response)), 201

        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Could not save changes to the server."
            }
            return make_response(jsonify(response)), 500


class GetAllModels(MethodView):
    """This class gets all models related to a particular project."""
    @jwt_required
    def get(self, project_id):
        """Handle GET request for this view. Url --> /api/v1/mlclassifier/all/<int:project_id>"""
        try:
            if not project_id:
                response = {
                    "success":False,
                    "msg": "Project ID not provided"
                }
                return make_response(jsonify(response)), 400
            
            models = find_ml_classifiers(project_id)
            project_models = []
            for model in models:
                project_models.append({
                    "id": model["id"],
                    "name": model["name"],
                    "type": model["type"],
                    "source": model["source"]
                })

            response = {
                "success": True,
                "msg": "Model found",
                "body": project_models
            }
            return make_response(jsonify(response)), 200
        
        except Exception:
            response = {
                "success":False,
                "msg": "Something went wrong!"
                }
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500


class GetTrainedModels(MethodView):
    """This class gets all trained models related to a particular project."""
    @jwt_required
    def get(self, project_id):
        """Handle GET request for this view. Url --> /api/v1/mlclassifier/trained/<int:project_id>"""
        try:
            if not project_id:
                response = {
                    "success":False,
                    "msg": "Project ID not provided"
                }
                return make_response(jsonify(response)), 400
            
            models = find_ml_classifiers(project_id)
            project_models = []
            for model in models:
                if model["saved_model_url"] is not None:
                    project_models.append({
                        "name": model["name"],
                        "transfer_source": model["saved_model_url"]
                    })

            response = {
                "success": True,
                "msg": "Trained models found",
                "body": project_models
            }
            return make_response(jsonify(response)), 200
        
        except Exception:
            response = {
                "success":False,
                "msg": "Something went wrong!"
                }
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500


class Train(MethodView):
    """
    This class trains a saved model
    """
    @jwt_required
    def post(self, mlclassifier_id):
        """Handle POST request for this view. Url --> /api/v1/mlclassifier/train/<int:mlclassifier_id>"""
        try:
            if not mlclassifier_id:
                response = {
                    "success": False,
                    "msg": "Provide the mlclassifier_id."
                }
                return make_response(jsonify(response)), 400

            ml_classifier = MLClassifier.query.filter_by(id=mlclassifier_id).first()

            if ml_classifier is None:
                response = {
                    "success": False,
                    "msg": "Model not found."
                }
                return make_response(jsonify(response)), 404

            # Create images dataframe
            image_df = pd.DataFrame(columns=["imagename", "label"])
            # Go through each label in the model
            for label in ml_classifier.labels:
                # Go through each instance of the label
                label_data = LabelData.query.filter_by(label_id=label.id).all()
                for data in label_data:
                    image = Image.query.filter_by(id=data.image_id).first()
                    image_df = image_df.append({"imagename": image.image_url,
                                    "label": label.label_name
                                    }, ignore_index=True)

            # Create model
            cl = Classifier()

            # Set hyperparameters
            cl.set_learning_rate(ml_classifier.learning_rate)
            cl.set_optimizer(ml_classifier.optimizer)
            cl.set_loss(ml_classifier.loss)
            cl.set_metrics(ml_classifier.metric)
            cl.set_batch_size(ml_classifier.batch_size)
            cl.set_epochs(ml_classifier.epochs)

            with open(ml_classifier.preprocessing_steps_json_url) as f:
                preprocessing_data = json.load(f)

            # Add image preprocessing
            cl.add_preprocessing_steps(preprocessing_data["steps"], ml_classifier.validation)

            # Load the data
            parent_dir = config['development'].UPLOAD_FOLDER
            path = os.path.join(parent_dir, str(ml_classifier.project_id))
            cl.load_data(data=image_df, directory=path, test_split=ml_classifier.test)

            # Set the layers
            if ml_classifier.source == "upload":
                cl.load_model(f"./ml_files/models/{mlclassifier_id}/savedmodel")
            else:
                if ml_classifier.source == "transfer":
                    cl.set_transfer_source(ml_classifier.transfer_source)
                    
                with open(ml_classifier.layers_json_url) as f:
                    layers_data = json.load(f)

                cl.add_layers(layers_data["layers"])

            # Compile
            cl.compile()

            # Set graph directory
            ml_classifier.loss_graph_url = f"/ml_files/graphs/{ml_classifier.id}/loss.jpg"
            ml_classifier.accuracy_graph_url = f"/ml_files/graphs/{ml_classifier.id}/accuracy.jpg"
            cl.set_graph_directory(f"./ml_files/graphs/{ml_classifier.id}")

            # Fit
            cl.fit()

            # Save the model
            cl.save("./ml_files/models", ml_classifier.id)
            saved_model_url = f"./ml_files/models/{mlclassifier_id}/savedmodel"
            ml_classifier_data = update_ml_classifier({
                "id": mlclassifier_id,
                "savedModelUrl": saved_model_url
            })

            response = {
                "success": True,
                "msg": "ML Classifier trained successfully.",
                "body": ml_classifier_data
            }

            return make_response(jsonify(response)), 200

        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Data could not be fetched"
            }

            return make_response(jsonify(response)), 404


class Test(MethodView):
    """This class tests a trained model using an image."""
    @jwt_required
    def post(self, mlclassifier_id):
        """
        Handle POST request for this view.
        Url --> /api/v1/mlclassifer/test/<int:mlclassifier_id>
        """

        try:
            mlclassifier_id = mlclassifier_id
            image = request.files['imagefile']

        except Exception as err:
            response = {
                "success": False,
                "msg": "Please provide all the required fields"
            }
            return make_response(jsonify(response)), 400

        # Load the model and test it
        try:
            ml_classifier = MLClassifier.query.get(mlclassifier_id)

            if ml_classifier:
                """Load the classifier and use image for testing."""
                cl = Classifier()
                cl.load_model(f"./ml_files/models/{mlclassifier_id}/savedmodel")
                test_result = cl.evaluate(os.path.join(ml_files_dir, "test_img"), 
                                            os.path.join(ml_files_dir, "models"),
                                            mlclassifier_id, 
                                            image)
            else:
                # There is no model with the given id.
                response = {
                    "message": "Model with given ID does not exist. Please try again."}
                return make_response(jsonify(response)), 401   

            response = {
                "success": True,
                "msg": "Model tested successfully.",
                "body": test_result
            }
            return make_response(jsonify(response)), 201

        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Could not test the model."
            }
            return make_response(jsonify(response)), 500


class Export(MethodView):
    """This class exports a model."""
    @jwt_required
    def get(self, mlclassifier_id):
        """
        Handle GET request for this view.
        Url --> /api/v1/mlclassifer/export/<int:mlclassifier_id>
        """
        # getting JSON data from request
        post_data = request.get_json(silent=True, force=True)

        try:
            mlclassifier_id = mlclassifier_id
            export_type = post_data["exportType"]

        except Exception as err:
            response = {
                "success": False,
                "msg": "Please provide all the required fields."
            }
            return make_response(jsonify(response)), 400

        ml_classifier = MLClassifier.query.get(mlclassifier_id)

        if ml_classifier:
            # Converting and exporting the model
            try:
                if export_type == "savedmodel":
                    # return the model zip folder
                    # successfully
                    zip_file_dir = ml_files_dir + f"/models/{mlclassifier_id}/model.zip"
                    zipf = zipfile.ZipFile(zip_file_dir,'w', zipfile.ZIP_DEFLATED)
                    for subdir, dirs, files in os.walk(ml_files_dir + f"/models/{mlclassifier_id}/savedmodel/"):
                        for file in files:
                            zipf.write(os.path.join(subdir, file))
                    zipf.close()
                    return send_file(zip_file_dir,
                                    mimetype = 'zip',
                                    attachment_filename= 'model.zip',
                                    as_attachment = True)
                elif export_type == "h5":
                    # Create model
                    cl = Classifier()
                    cl.load_model(f"./ml_files/models/{mlclassifier_id}/savedmodel")
                    cl.save("./ml_files/models", mlclassifier_id, "h5")

                    # return the model file in h5 format
                    # successfully
                    return send_from_directory(ml_files_dir + f"/models/{mlclassifier_id}/h5", filename=f"saved_model.h5", as_attachment=True)
                else:
                    # Create model
                    cl = Classifier()
                    cl.load_model(f"./ml_files/models/{mlclassifier_id}/savedmodel")
                    cl.save("./ml_files/models", mlclassifier_id, "onnx")

                    # return the model file in h5 format
                    # successfully
                    return send_from_directory(ml_files_dir + f"/models/{mlclassifier_id}/onnx", filename=f"saved_model.onnx", as_attachment=True)

            except Exception as err:
                print("Error occured: ", err)
                response = {
                    "success": False,
                    "msg": "Could not export the model."
                }
                return make_response(jsonify(response)), 500
        else:
            # There is no model with the given id.
            response = {
                    "success": False,
                    "message": "Model with given id does not exist. Please try again."
                }
            return make_response(jsonify(response)), 401


class Upload(MethodView):
    """This class saves an uploaded model."""
    @jwt_required
    def post(self, mlclassifier_id):
        """
        Handle POST request for this view.
        Url --> /api/v1/mlclassifer/upload/<int:mlclassifier_id>
        """

        try:
            mlclassifier_id = mlclassifier_id
            model_file = request.files['modelFile']

        except Exception as err:
            response = {
                "success": False,
                "msg": "Please provide all the required fields"
            }
            return make_response(jsonify(response)), 400

        # Load the model and save the model file to it
        try:
            ml_classifier = MLClassifier.query.get(mlclassifier_id)

            if ml_classifier:
                """Save the model file."""
                save_uploaded_model(model_file, os.path.join(ml_files_dir, "models"), mlclassifier_id)
                saved_model_url = f"./model_files/models/{mlclassifier_id}/savedmodel"
                ml_classifier = update_ml_classifier({
                    "id": mlclassifier_id,
                    "saved_model_url": saved_model_url
                })
            else:
                # There is no model with the given id.
                response = {
                    "message": "Model with given ID does not exist. Please try again."}
                return make_response(jsonify(response)), 401   

            response = {
                "success": True,
                "msg": "Model tested successfully.",
                "body": ml_classifier
            }
            return make_response(jsonify(response)), 201

        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Could not upload the model file."
            }
            return make_response(jsonify(response)), 500


mlclassifiercontroller = {
    "create": CreateMLClassifier.as_view("create"),
    "mlclassifier": MLClassifierInfo.as_view("mlclassifier"),
    "get_all_models": GetAllModels.as_view("get_all_models"),
    "get_trained_models": GetTrainedModels.as_view("get_trained_models"),
    "train": Train.as_view("train"),
    "test": Test.as_view("test"),
    "export": Export.as_view("export"),
    "upload": Upload.as_view("upload")
}
