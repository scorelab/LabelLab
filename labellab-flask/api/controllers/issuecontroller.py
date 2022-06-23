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
    find_all_issues_by_project_id,
    fetch_all_issue_by_category,
    fetch_all_issue_by_entity_type,
    update_issue,
    fetch_all_issue_by_team_id,
    pagination
)
from api.helpers.comment import fetch_comments_by_issue_id
from api.helpers.user import get_user_roles

from api.middleware.logs_decorator import record_logs
from api.middleware.project_member_access import project_member_only
from api.middleware.project_admin_access import admin_only
from api.middleware.issue_decorator import issue_exists

allowed_categories = config[os.getenv("FLASK_CONFIG") or "development"].CATEGORIES_ALLOWED
allowed_entity_types = config[os.getenv("FLASK_CONFIG") or "development"].ENTITY_TYPES_ALLOWED


class CreateIssues(MethodView):
    """This class creates a new Issue."""
    @jwt_required
    @project_member_only
    @record_logs
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
    @project_member_only
    def get(self, project_id):
        try:
            if not project_id:        
                response = {
                    "success": False,
                    "msg": "Provide the project_id.",
                }
                return make_response(jsonify(response)), 422

            issues = find_all_issues_by_project_id(project_id)
            issues = pagination(issues, request.args)

            if not issues.items:
                response = {
                        "success": False,
                        "msg": "No Issue found",
                        "body": {}
                }
                return make_response(jsonify(response)), 404
            
            response = {
                    "success": True,
                    "msg": "Issues fetched successfully.",
                    "body": issues
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
    @issue_exists
    def get(self,project_id, issue_id):
        try:
            if not issue_id:
                response = {
                    "success":False,
                    "msg": "Issue id not provided"
                }
                return make_response(jsonify(response)), 400
            
            issue = find_by_id(issue_id)
            issue['comments'] = fetch_comments_by_issue_id(issue_id)
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
    @issue_exists
    @record_logs
    def put(self,project_id, issue_id):
        
        post_data = request.get_json(silent=True, force=True)
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
            data = {
                "title": title,
                "description": description,
                "category": category
            }
                
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
    @issue_exists
    @record_logs
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

class AssignIssue(MethodView):
    """
    This method assigns an issue to a user.
    """
    @jwt_required
    @admin_only
    @issue_exists
    @record_logs
    def put(self, project_id, issue_id):
        """
        Handle PUT request for this view.
        Url --> /api/v1/issue/assign/<int:project_id>/<int:issue_id>
        """
        # getting JSON data from request
        post_data = request.get_json(silent=True, force=True)
        try:
            assignee_id = post_data['assignee_id']
        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        try:
            # If assigned user is not a project member, return error
            user_roles = get_user_roles(assignee_id, project_id)
            if len(user_roles) == 0:
                response = {
                    'success': False,
                    'msg': 'Assigned user is not a project member',
                }
                return make_response(jsonify(response)), 400

            data = {
                "assignee_id" : assignee_id
            }
            issue_new = update_issue(issue_id, data)

            response = {
                    "success": True,
                    "msg": "Issue assigned.",
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


class FetchCategoryIssuesView(MethodView):

    """
    This route fetches all project issue of a particular category
     URL:- /api/v1/issue/<int:project_id>/category/<string:category>
    """
    @jwt_required
    @project_member_only
    def get(self,project_id, category):
        try:
            if not project_id:        
                response = {
                    "success": False,
                    "msg": "Provide the project_id.",
                }
                return make_response(jsonify(response)), 422
            
            if category not in allowed_categories:  
                response = {
                    "success": False,
                    "msg": "Invalid category"
                }
                return make_response(jsonify(response)), 422
            
            issue_category = fetch_all_issue_by_category(project_id,category)
            issue_category = pagination(issue_category, request.args)

            response = {
                'success':True,
                'data':issue_category
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
    @project_member_only
    def get(self,project_id, team_id):
        try:
            if not project_id:        
                response = {
                    "success": False,
                    "msg": "Provide the project_id.",
                }
                return make_response(jsonify(response)), 422
            
            if not team_id:        
                response = {
                    "success": False,
                    "msg": "Provide the team_id.",
                }
                return make_response(jsonify(response)), 422
            
            issue_team = fetch_all_issue_by_team_id(project_id,team_id) 
            issue_team = pagination(issue_team, request.args) 
            response = {
                "success": True,
                "msg": "Issues found",
                "body": issue_team
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


class FetchEntityIssuesView(MethodView):

    """
    This route fetches all project issue of a particular category
     URL:- /api/v1/issue/<int:project_id>/entity/<string:entity_type>/<int:entity_id>
    """
    @jwt_required
    @project_member_only
    def get(self,project_id, entity_type, entity_id):
        try:
            if not project_id:        
                response = {
                    "success": False,
                    "msg": "Provide the project_id.",
                }
                return make_response(jsonify(response)), 422
            
            if not entity_id:        
                response = {
                    "success": False,
                    "msg": "Provide the entity_id.",
                }
                return make_response(jsonify(response)), 422
            
            if entity_type not in allowed_entity_types:
                response = {
                    'success': False,
                    'msg': 'Invalid entity type'
                }
                return make_response(jsonify(response)), 400
            
            issue_entity = fetch_all_issue_by_entity_type(project_id, entity_type, entity_id)
            issue_entity = pagination(issue_entity, request.args)
            response = {
                "success": True,
                "msg": "Issues found",
                "body": issue_entity
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
    "assign_issue": AssignIssue.as_view("assign_issue"),
    "fetch_category_issue":FetchCategoryIssuesView.as_view("fetch_category_issue"),
    "fetch_team_issue": FetchTeamIssuesView.as_view("fetch_team_issue"),
    "fetch_entity_issue":FetchEntityIssuesView.as_view("fetch_entity_issue")
}
