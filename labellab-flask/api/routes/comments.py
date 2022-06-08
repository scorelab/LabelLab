from flask import Blueprint

from api.controllers import commentcontroller

commentsprint = Blueprint("comments", __name__)

commentsprint.add_url_rule(
    "/comment/create/<int:issue_id>",
    view_func=commentcontroller.commentController["add_comment"], 
    methods=["POST"]
)

commentsprint.add_url_rule(
    "/comment/get/<int:issue_id>",
    view_func=commentcontroller.commentController["get_all_comment"], 
    methods=["GET"]
)

commentsprint.add_url_rule(
    "/comment/comment_info/<int:issue_id>/<int:comment_id>",
    view_func=commentcontroller.commentController["comment"], 
    methods=["GET","DELETE","PUT"]
)