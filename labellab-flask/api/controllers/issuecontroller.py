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
    find_by_id,
    delete_by_id as delete_issue,
    save as save_issue,
    issue_attribute_validator,
    update_issue
)
from api.helpers.user import get_user_roles
from api.middleware.project_member_access import project_member_only

allowed_categories = config[os.getenv("FLASK_CONFIG") or "development"].CATEGORIES_ALLOWED

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
        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        if category not in allowed_categories:
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
            for attribute in issue_attribute_validator:
                try:
                    attribute_value = post_data[attribute['key']]
                    #Check if enum present
                    #If yes, validate against it
                    if 'enum' in attribute and attribute_value not in attribute['enum']:
                        response = {
                            'success': False,
                            'msg': f'{attribute["key"]} has an invalid value'
                        }
                        return make_response(jsonify(response)), 400

                    setattr(issue, attribute['key'], attribute_value)
                except:
                    #If field not present, then continue iterating
                    continue

            issue_new = save_issue(issue)
            
        except Exception as err:
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
    @project_member_only
    def get(self,project_id, issue_id):
        try:
            if not issue_id:
                response = {
                    "success":False,
                    "msg": "Issue id not provided"
                }
                return make_response(jsonify(response)), 400
            
            issue = find_by_id(issue_id)
            if not issue:
                response = {
                    'success': False,
                    'msg': 'Issue does not exist',
                }
                return make_response(jsonify(response)), 404 

            response = {
                "success": True,
                "msg": "Issue found",
                "body": issue
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
    @project_member_only
    def put(self,project_id, issue_id):
        
        post_data = request.get_json(silent=True, force=True)
        current_user = get_jwt_identity()
        try:
            title = post_data["title"]
            description = post_data["description"]
            category = post_data["category"]
        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        if category not in allowed_categories:
                response = {
                        "success": False,
                        "msg": "category not allowed."
                    }
                return make_response(jsonify(response)), 400

        try:
            issue = find_by_id(issue_id)

            if not issue:
                response = {
                    "success": False,
                    "msg": "Issue not present."}
                return make_response(jsonify(response)), 404

            data = {
                "title": title,
                "description": description,
                "category": category
            }

            # Assign the issue if current user has admin role
            user_roles = get_user_roles(current_user, project_id)

            if 'admin' not in user_roles:
                response = {
                    'success': False,
                    'msg': 'Only an admin can assign issue',
                }
                return make_response(jsonify(response)), 401

            try:
                data['assignee_id'] = post_data['assignee_id']
            except:
                pass
                
            # Update optional fields
            for attribute in issue_attribute_validator:
                try:
                    attribute_value = post_data[attribute['key']]
                    if 'enum' in attribute and attribute_value not in attribute['enum']:
                        response = {
                            'success': False,
                            'msg': f'{attribute["key"]} has an invalid value'
                        }
                        return make_response(jsonify(response)), 400

                    data[attribute['key']] = attribute_value
                except:
                    continue

            issue_new = update_issue(issue_id, data)

            response = {
                    "success": True,
                    "msg": "Issue updated.",
                    "body": issue_new
            }
            return make_response(jsonify(response)), 201
        
        except Exception:
            response = {
                "success":False,
                "msg": "Something went wrong!"
                }
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500
    
    @jwt_required
    @project_member_only
    def delete(self,project_id, issue_id):
        try:
            if not issue_id:
                response = {
                    "success":False,
                    "msg": "Issue id not provided"
                    }
                return make_response(jsonify(response)), 500
            
            delete_issue(issue_id)
            response = {
                "success": True,
                "msg": "Issue deleted."
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