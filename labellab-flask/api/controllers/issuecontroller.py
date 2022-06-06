import os
from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)

from api.config import config
from api.models.Issue import Issue

from api.helpers.issue import (
    save as save_issue
)
from api.middleware.project_member_access import project_member_only

allowed_priorities = config[os.getenv("FLASK_CONFIG") or "development"].ISSUE_PRIORITIES_ALLOWED
allowed_statuses = config[os.getenv("FLASK_CONFIG") or "development"].ISSUE_STATUSES_ALLOWED
allowed_categories = config[os.getenv("FLASK_CONFIG") or "development"].CATEGORIES_ALLOWED
allowed_entity_types = config[os.getenv("FLASK_CONFIG") or "development"].ENTITY_TYPES_ALLOWED

class CreateIssues(MethodView):
    """This class creates a new Issue."""
    @jwt_required
    @project_member_only
    def post(self, project_id):
        """
        Handle POST request for this view.
        Url --> /api/v1/issue/create/<int:project_id>
        """
        # getting JSON data from request
        post_data = request.get_json(silent=True, force=True)
        current_user = get_jwt_identity()
        # Load model with necessary fields 
        try:
            title = post_data["title"]
            description = post_data["description"]
            category = post_data["category"]
        except Exception:
            response = {
                "success": False,
                "msg": "Please provide all the required fields."
            }
            return make_response(jsonify(response)), 400
        if category not in allowed_categories:
                print("Error occured: category not allowed")
                response = {
                        "success": False,
                        "msg": "category not allowed."
                    }
                return make_response(jsonify(response)), 400
        
        """Save the new Issue"""
        try:
            issue = Issue(
                title=title, 
                description=description, 
                project_id=project_id,
                created_by=current_user,
                category=category,
            )
            # Save the model with optional fields
            try:
                priority=post_data["priority"]
                if priority not in allowed_priorities:
                    print("Error occured: priority not allowed")
                    response = {
                            "success": False,
                            "msg": "priority not allowed."
                        }
                    return make_response(jsonify(response)), 400
                issue.priority = priority
            except:
                pass

            try:
                status=post_data["status"]
                if status not in allowed_statuses:
                    print("Error occured: status not allowed")
                    response = {
                            "success": False,
                            "msg": "status not allowed."
                        }
                    return make_response(jsonify(response)), 400
                issue.status = status
            except:
                pass

            try:
                issue.team_id=post_data["team_id"]
            except:
                pass

            try:
                entity_type=post_data["entity_type"]
                if entity_type not in allowed_entity_types:
                    print("Error occured: entity type not allowed")
                    response = {
                            "success": False,
                            "msg": "entity type not allowed."
                        }
                    return make_response(jsonify(response)), 400
                issue.entity_type = entity_type
            except:
                pass

            try:
                issue.entity_id=post_data["entity_id"]
            except:
                pass

            try:
                issue.due_date=post_data["due_date"]
            except:
                pass

            issue_new = save_issue(issue)
            
        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Something went wrong!!"
            }
            return make_response(jsonify(response)), 500

        response = {
                    "success": True,
                    "msg": "New Issue was created successfully.",
                    "body": issue_new
                    }
        # return a response notifying the user that they registered
        # successfully
        return make_response(jsonify(response)), 201

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
     URL:- /api/v1/issue/<int:project_id>/team/<int:team_id>
    """
    @jwt_required
    def get(self,project_id, team_id):
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
    "create_issue": CreateIssues.as_view("create_issue"),
    "get_all_issues": GetAllIssues.as_view("get_all_issues"),
    "issue": IssueInfo.as_view("issue"),
    "fetch_category_issue":FetchCategoryIssuesView.as_view("fetch_category_issue"),
    "fetch_team_issue": FetchTeamIssuesView.as_view("fetch_team_issue")
}