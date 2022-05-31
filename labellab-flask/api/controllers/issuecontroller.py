import os
from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required,
)

from api.config import config
from api.models.Issue import Issue


class GetAllIssues(MethodView):
    """
    This class-based view handles fetching all issues within a project
    Url --> /api/v1/issue/<int:project_id>
    """
    @jwt_required
    def get(self, project_id):
        try:
            if not project_id:
                response = {
                    "success":False,
                    "msg": "Project id not provided"
                    }
                return make_response(jsonify(response)), 400
            
            # TODO:passing the issue body to the response            
            response = {
                "success": True,
                "msg": "Issues found",
                "body": "All issues fetched"
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


issueController = {
    "get_all_issues": GetAllIssues.as_view("get_all_issues")
}