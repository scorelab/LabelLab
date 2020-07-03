from datetime import datetime

from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    get_raw_jwt
)
from api.models.Image import Image
from api.helpers.image import (
    convert_and_save,
    get_dimensions,
    save as save_image,
    find_all_by_project_id as find_images,
    find_by_id,
    remove_image,
    delete_by_id
)


class SubmitImage(MethodView):
    """This class saves a new image."""
    @jwt_required
    def post(self, project_id):
        """
        Handle POST request for this view.
        Url --> /api/v1/image/create/<int:project_id>
        """
        # getting JSON data from request
        post_data = request.get_json(silent=True,
                                     force=True)
        current_user = get_jwt_identity()
        try:
            images = post_data["images"]
            image_names = post_data["image_names"]
            format = post_data["format"]

        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        project_id = project_id
        user_id = current_user
        
        if not project_id:
            response = {
                "success": False,
                "msg": "project id is not provided."
            }
            return make_response(jsonify(response)), 400

        ext = format.split('/')[1]

        # Saving the images on the server and 
        # then saving them to the database.
        try:
            images_new = []
            for i in range(len(images)):
                image = images[i]
                image_name = image_names[i]
                now = datetime.now()
                timestamp = datetime.timestamp(now)
                image_url = f"{user_id}_{image_name}_{timestamp}.{ext}"
                convert_and_save(image, project_id, image_url)
                img_data = get_dimensions(image)
                image_to_save = Image(
                    image_name = image_name,
                    image_url = image_url,
                    height = img_data['height'],
                    width = img_data['width'],
                    labelled = False,
                    project_id = project_id
                )
                image_new = save_image(image_to_save)
                images_new.append(image_new)

            response = {
                "success": True,
                "msg": "image saved to the server.",
                "body": images_new
            }
            return make_response(jsonify(response)), 201

        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Could not save images to the server."
            }
            return make_response(jsonify(response)), 500


class GetAllImages(MethodView):
    """This class-based view handles fetching of all the images of a image."""
    
    @jwt_required
    def get(self, project_id):
        """
        Handle GET request for this view. 
        Url ---> /api/v1/image/get/<int:project_id>
        """
        try:
            images = find_images(project_id)

            if not images:
                response = {
                    "success": False,
                    "msg": "Images not found."
                }
                return make_response(jsonify(response)), 404
            
            response = {
                "success": True,
                "msg": "Images fetched successfully.",
                "body": images
            }

            return make_response(jsonify(response)), 200
            
        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Data could not be fetched"
            }

            return make_response(jsonify(response)), 500


class GetImage(MethodView):
    """
    This methods gets the info of a particular image.
    Handle GET request for this view. 
    Url --> /api/v1/image/get_image/<int:image_id>
    """
    @jwt_required
    def get(self, image_id):
        try:
            if not image_id:
                response = {
                    "success":False,
                    "msg": "Image id not provided"
                    }
                return make_response(jsonify(response)), 400
            
            image= find_by_id(image_id)
            response = {
                "success": True,
                "msg": "Image found",
                "body": image
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


class DeleteImages(MethodView):
    """
    This methods deletes images.
    Handle POST request for this view. 
    Url --> /api/v1/image/delete
    """
    @jwt_required
    def post(self):
        post_data = request.get_json(silent=True,
                                     force=True)

        try:
            images_id = post_data["images"]

        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400
        
        try:
            for id in images_id:
                remove_image(id)
                delete_by_id(id)

            response = {
                "success": True,
                "msg": "Images deleted."
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


imageController = {
    "save_image": SubmitImage.as_view("save_image"),
    "get_all_images": GetAllImages.as_view("get_all_images"),
    "get_image": GetImage.as_view("get_image"),
    "delete_images": DeleteImages.as_view("delete_images")
}
