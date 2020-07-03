from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    get_raw_jwt
)

from api.config import config
from api.models.Label import Label
from api.helpers.label import (
    find_by_id, 
    find_by_label_name, 
    find_all_by_project_id,
    save as save_label, 
    delete_by_id as delete_label,
    update_label
)

allowed_labels = config['development'].LABELS_ALLOWED

class CreateLabel(MethodView):
    """This class creates a new Label."""
    @jwt_required
    def post(self, project_id):
        """
        Handle POST request for this view.
        Url --> /api/v1/label/create/<int:project_id>
        """
        # getting JSON data from request
        post_data = request.get_json(silent=True,
                                     force=True)
        try:
            label_name = post_data["label_name"]
            label_type = post_data["label_type"]
        except Exception:
            response = {
                "success": False,
                "msg": "Please provide all the required fields."
            }
            return make_response(jsonify(response)), 400
        
        if label_type not in allowed_labels:
                print("Error occured: label type not allowed")
                response = {
                        "success": False,
                        "msg": "Label type not allowed."
                    }
                return make_response(jsonify(response)), 400

        """Save the new Label."""
        try:
            label = Label(label_name=label_name, 
                        label_type=label_type, 
                        project_id=project_id)
            label_new = save_label(label)
            
        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Something went wrong!!"
            }
            return make_response(jsonify(response)), 500

        response = {
                    "success": True,
                    "msg": "Your Label was created successfully.",
                    "body": label_new
                    }
        # return a response notifying the user that they registered
        # successfully
        return make_response(jsonify(response)), 201


class GetAllLabels(MethodView):
    """This class-based view handles fetching of all Labels in a project."""
    
    @jwt_required
    def get(self, project_id):
        """
        Handle GET request for this view. 
        Url ---> /api/v1/label/get/<int:project_id>
        """
        try:
            if not project_id:
                response = {
                    "success": False,
                    "msg": "Provide the project_id."
                }
                return make_response(jsonify(response)), 400

            labels = find_all_by_project_id(project_id)

            if not labels:
                response = {
                    "success": False,
                    "msg": "Labels not found.",
                    "body": {}
                }
                return make_response(jsonify(response)), 200

            response = {
                "success": True,
                "msg": "Label fetched successfully.",
                "body": labels
            }

            return make_response(jsonify(response)), 200

        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Data could not be fetched"
            }

            return make_response(jsonify(response)), 404


class LabelInfo(MethodView):
    """
    This methods gets, deletes and updates the info of a particular Label.
    Handle GET, DELETE, PUT request for this view. 
    Url --> /api/v1/label/label_info/<int:label_id>
    """
    @jwt_required
    def get(self, label_id):
        try:
            if not label_id:
                response = {
                    "success":False,
                    "msg": "Label id not provided"
                }
                return make_response(jsonify(response)), 400
            
            label = find_by_id(label_id)
            response = {
                "success": True,
                "msg": "Label found",
                "body": label
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
    def delete(self, label_id):
        try:
            if not label_id:
                response = {
                    "success":False,
                    "msg": "Label id not provided"
                    }
                return make_response(jsonify(response)), 500
            
            delete_label(label_id)
            response = {
                "success": True,
                "msg": "Label deleted."
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
    def put(self, label_id):
        """Handle PUT request for this view. Url --> /api/v1/Label/<int:label_id>"""
        # getting JSON data from request
        post_data = request.get_json(silent=True,
                                     force=True)
        try:
            label_name = post_data["label_name"]
            label_type = post_data["label_type"]
        except Exception:
            response = {
                "success": False,
                "msg": "Please provide all the required fields."}
            return make_response(jsonify(response)), 400
        
        if label_type not in allowed_labels:
                print("Error occured: label type not allowed")
                response = {
                        "success": False,
                        "msg": "Label type not allowed."
                    }
                return make_response(jsonify(response)), 400

        try:
            label = find_by_id(label_id)

            if not label:
                response = {
                    "success": False,
                    "msg": "Label not present."}
                return make_response(jsonify(response)), 404

            data = {
                "label_name": label_name,
                "label_type": label_type
            }

            label_new = update_label(label_id, data)

            response = {
                    "success": True,
                    "msg": "Label updated.",
                    "body": label_new
            }
            return make_response(jsonify(response)), 201

        except Exception as err:
            print("Error occurred: ", err)
            response = {
                "success": False,
                "msg": "Label not present."}
            return make_response(jsonify(response)), 404


labelController = {
    "create_label": CreateLabel.as_view("create_label"),
    "get_all_labels": GetAllLabels.as_view("get_all_labels"),
    "label": LabelInfo.as_view("label")
}