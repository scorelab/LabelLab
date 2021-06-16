from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required
)
from datetime import datetime

from api.config import config
from api.models.Label import Label
from api.helpers.label import (
    find_all_by_project_id
)
from api.helpers.analytics import (
    get_color, 
    get_months, 
    get_label_data,
    get_label_counts
)
from api.middleware.project_member_access import project_member_only

class TimeLabel(MethodView):
    """This class shows the time dependency of a label after being created."""
    @jwt_required
    @project_member_only
    def get(self, project_id):
        """
        Handle GET request for this view.
        Url --> /api/v1/time_label/get/<int:project_id>
        """
        if project_id is None:
            response = {
                "success": False,
                "msg": "Please provide the project id."
            }
            return make_response(jsonify(response)), 400
        try:
            labels = find_all_by_project_id(project_id)
            if not labels:
                response = {
                    "success": False,
                    "msg": "No labels present in project."
                }
                return make_response(jsonify(response)), 200
            
            label_data = []
            for label in labels:
                date_time =  datetime.strptime(label["created_at"], '%Y-%m-%d %H:%M:%S')
                month = date_time.strftime("%m")
                label_data.append(int(month))

            data = {
                "labels": get_months(6),
                "datasets": [
                    {
                        "label": 'Number of Labels',
                        "data": get_label_data(label_data),
                        "background_color": get_color(6)
                    }
                ]
            }
            response = {
                    "success": True,
                    "msg": "LabelData fetched.",
                    "body": data
                }
            return make_response(jsonify(response)), 200

        except Exception as err:
            print(err)
            response = {
                "success": False,
                "msg": "Something went wrong!"
            }
            return make_response(jsonify(response)), 500
            
class CountLabel(MethodView):
    """This class-based view handles fetching the info of a label data."""
    
    @jwt_required
    @project_member_only
    def get(self, project_id):
        """
        Handle GET request for this view. 
        Url ---> /api/v1/label_count/get/<int:project_id>
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
                    "msg": "No labels present in this project.",
                    "body": {}
                }
                return make_response(jsonify(response)), 200

            count_data = get_label_counts(labels)

            response = {
                "success": True,
                "msg": "Label count data fetched succesfully.",
                "body": count_data
            }

            return make_response(jsonify(response)), 200

        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Data could not be fetched"
            }

            return make_response(jsonify(response)), 500


analyticsController = {
    "time_label": TimeLabel.as_view("time_label"),
    "label_counts": CountLabel.as_view("label_counts")
}