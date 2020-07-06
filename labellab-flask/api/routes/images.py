from flask import Blueprint

from api.controllers import imagescontroller

imagesprint = Blueprint("images", __name__)

imagesprint.add_url_rule(
    "/image/create/<int:project_id>", 
    view_func=imagescontroller.imageController["save_image"], 
    methods=["POST"]
)

imagesprint.add_url_rule(
    "/image/get/<int:project_id>", 
    view_func=imagescontroller.imageController["get_all_images"], 
    methods=["GET"]
)

imagesprint.add_url_rule(
    "/image/get_image/<int:image_id>", 
    view_func=imagescontroller.imageController["get_image"], 
    methods=["GET"]
)

imagesprint.add_url_rule(
    "/image/delete", 
    view_func=imagescontroller.imageController["delete_images"], 
    methods=["POST"]
)
imagesprint.add_url_rule(
    "/image/update/<int:image_id>", 
    view_func=imagescontroller.imageController["update_labels"], 
    methods=["PUT"]
)