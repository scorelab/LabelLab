import os
from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required,
)

from api.config import config
from api.models.Issue import Issue

class CreateIssues(MethodView):
    """
    This class-based view handles fetching all issues within a project
    Url --> /api/v1/issue/create/<int:project_id>
    """
    @jwt_required
    def post(self, project_id):
        try:
                        
            response = {
                "success": True,
                "msg": "Issue Created",
                "body": "New Issue Create for this project"
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

class GetAllIssues(MethodView):
    """
    This class-based view handles fetching all issues within a project
    Url --> /api/v1/issue/get/<int:project_id>
    """
    @jwt_required
    def get(self, project_id):
        try:
                        
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

class IssueInfo(MethodView):
    """
    This methods GET,DELETE and PUT the info of a particular Issue.
    Url --> /api/v1/issue/issue_info/<int:project_id>/<int:issue_id>
    """
    @jwt_required
    def get(self,project_id, issue_id):
        try:
                        
            response = {
                "success": True,
                "msg": "Issues found",
                "body": "Get Issue by ID"
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
    def put(self,project_id, issue_id):
        try:
                        
            response = {
                "success": True,
                "msg": "Issues updated",
                "body": "Issue Details upadted"
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
    def delete(self,project_id, issue_id):
        try:
                        
            response = {
                "success": True,
                "msg": "Issues Deleted",
                "body": "Issue Details deleted"
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

class FetchCategoryIssuesView(MethodView):

    """
    This route fetches all project issue of a particular category
     URL:- /api/v1/issue/<int:project_id>/category/<string:category>
    """
    @jwt_required
    def get(self,project_id, category):
        try:
                        
            response = {
                "success": True,
                "msg": "Issues found",
                "body": "Get Issue by Category"
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

class FetchTeamIssuesView(MethodView):

    """
    This route fetches all project issue of a particular category
     URL:- /api/v1/issue/<int:project_id>/team/<string:team>
    """
    @jwt_required
    def get(self,project_id, team):
        try:
                        
            response = {
                "success": True,
                "msg": "Issues found",
                "body": "Get Issue by team"
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
    "createissue": CreateIssues.as_view("createissue"),
    "get_all_issues": GetAllIssues.as_view("get_all_issues"),
    "issue": IssueInfo.as_view("issue"),
    "fetch_category_issue":FetchCategoryIssuesView.as_view("fetch_category_issue"),
    "fetch_team_issue": FetchTeamIssuesView.as_view("fetch_team_issue")
}