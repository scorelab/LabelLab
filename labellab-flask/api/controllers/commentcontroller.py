import os
from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from api.helpers.user import(
    find_by_user_id
)

from api.helpers.comment import(
    save as save_comment
)

from api.middleware.logs_decorator import record_logs

from api.models.Comment import Comment

class AddComment(MethodView):
    """
    This class-based view Adds a comment to an issue.
    Url --> /api/v1/comment/create/<int:issue_id>
    """
    @jwt_required
    @record_logs
    def post(self, issue_id):
        # getting JSON data from request
        post_data = request.get_json(silent=True, force=True)
        current_user = get_jwt_identity()
        user = find_by_user_id(current_user)
        # Load model with necessary fields 
        try:
            comment_body = post_data["body"]
        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400
        
        try:
            comment = Comment(
                        body=comment_body,
                        issue_id=issue_id,
                        user_id=current_user,
                        username=user['username']
                )

        except Exception as err:
            response = {
                "success": False,
                "msg": "Something went wrong!!"
            }
            return make_response(jsonify(response)), 500
        
        new_comment = save_comment(comment)
        
        response = {
                "success": True,
                "msg": "New Comment Added",
                "body": new_comment
            }
        # return a response notifying about posting a new comment
        return make_response(jsonify(response)), 201
        

class GetAllComments(MethodView):
    """
    This class-based view returns all comments for an issue
    Url --> /api/v1/comment/get/<int:issue_id>
    """
    @jwt_required
    def get(self, issue_id):
        try:
                        
            response = {
                "success": True,
                "msg": "Fetched all Comments",
                "body": "Returned all comments related to this issue"
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

class CommentInfo(MethodView):
    """
    This methods GET,DELETE and PUT the info of a particular Comment in an issue.
    Url --> /api/v1/comment/comment_info/<int:issue_id>/<int:comment_id>
    """
    @jwt_required
    def get(self, issue_id,comment_id):
        try:
                        
            response = {
                "success": True,
                "msg": "Fetched the Comment",
                "body": "Returned comment related to this issue and ID"
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
    def put(self, issue_id,comment_id):
        try:
                        
            response = {
                "success": True,
                "msg": "Updated the Comment",
                "body": "Updated comment related to this issue and ID"
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
    def delete(self, issue_id,comment_id):
        try:
                        
            response = {
                "success": True,
                "msg": "Deleted the Comment",
                "body": "Deleted the comment related to this issue and ID"
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


commentController = {
    "add_comment": AddComment.as_view("add_comment"),
    "get_all_comment":GetAllComments.as_view("get_all_comment"),
    "comment":CommentInfo.as_view("comment")
}