import os
from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required,
)

class AddComment(MethodView):
    """
    This class-based view Adds a comment to an issue.
    Url --> /api/v1/comment/create/<int:issue_id>
    """
    @jwt_required
    def post(self, issue_id):
        try:
                        
            response = {
                "success": True,
                "msg": "Comment Added",
                "body": "New Comment added for this issue"
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