from datetime import datetime

from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    get_raw_jwt
)
from api.models.Image import Image
from api.models.LabelData import LabelData
from api.models.Point import Point
from api.helpers.user import (
    get_user_roles
)
from api.helpers.image import (
    convert_and_save,
    get_dimensions,
    save as save_image,
    find_all_by_project_id as find_images,
    find_by_id,
    update_image,
    remove_image,
    delete_by_id,
    get_path
)
from api.helpers.labeldata import (
    find_by_id as find_labeldata,
    find_by_image_id,
    update_labeldata,
    save as save_labeldata,
    delete_by_id as delete_labeldata
)
from api.helpers.point import (
    update_point,
    save as save_point
)
from path_tracking.extract_exif import ImageMetaData
from api.middleware.logs_decorator import record_logs
from api.middleware.image_access import image_only
from api.middleware.image_labelling_access import image_labelling_only
from api.middleware.project_member_access import project_member_only

class SubmitImage(MethodView):
    """This class saves a new image."""
    @jwt_required
    @image_only
    @record_logs
    def post(self, project_id):
        """
        Handle POST request for this view.
        Url --> /api/v1/image/create/<int:project_id>
        """
        current_user = get_jwt_identity()
        try:
            images = request.files.getlist("images")

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

        # Saving the images on the server and 
        # then saving them to the database.
        try:
            images_new = []
            for i in range(len(images)):
                image = images[i]
                image_name = image.filename.split('.')[0]
                ext = image.filename.split('.')[1]
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
    @project_member_only
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
    @project_member_only
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
    Url --> /api/v1/image/delete/<int:project_id>
    """
    @jwt_required
    @image_only
    @record_logs
    def post(self, project_id):
        
        post_data = request.get_json(silent=True, force=True)

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

class UpdateLabels(MethodView):
    """
    This methods updates labels.
    Handle PUT request for this view. 
    Url --> /api/v1/image/update/<int:image_id>/
    """
    @jwt_required
    @record_logs
    def put(self, image_id):
        current_user = get_jwt_identity()
        post_data = request.get_json(silent=True,
                                     force=True)
        try:
            labels = post_data["labels"]
            height = post_data["height"]
            width = post_data["width"]
            project_id = post_data["project_id"]
            labelled = post_data["labelled"]

        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400
        
        try:
            roles = get_user_roles(current_user, project_id)

            if "admin" not in roles:
                if "image labelling" not in roles:
                    print("Error occured: user not admin or has image labelling role")
                    response = {
                            "success": False,
                            "msg": "User neither has 'admin' nor 'image labelling' role."
                        }
                    return make_response(jsonify(response)), 403

            format_data = []
            for label_id in labels:
                if labels[label_id]:
                    for i in range(len(labels[label_id])):
                        labels[label_id][i]['label_id'] = int(label_id)
                        format_data.append(labels[label_id][i])
            labels = format_data
            if not image_id:
                response = {
                    "success":False,
                    "msg": "Image id not provided"
                    }
                return make_response(jsonify(response)), 400
            image = find_by_id(image_id)
            if not image:
                response = {
                    "success":False,
                    "msg": "Image not present"
                    }
                return make_response(jsonify(response)), 404
            data = {
                "height": height,
                "width": width,
                "labelled": labelled
            }
            # Converting labeldata in the format the frontend 
            # understands the data. 
            new_image = update_image(image_id, data)
            existing_labeldata = find_by_image_id(image_id)
            existing_labeldata_ids = []
            response_labels_ids = []
            if existing_labeldata:
                for i in range(len(existing_labeldata)):
                    existing_labeldata_ids.append(existing_labeldata[i]['id'])
                for i in range(len(labels)):
                    response_labels_ids.append(labels[i]['id'])
                missing_labelsdata = list(set(existing_labeldata_ids) - set(response_labels_ids))

                if missing_labelsdata:
                    for i in range(len(missing_labelsdata)):
                        delete_labeldata(missing_labelsdata[i])

            new_labeldatas = []
            res_labeldata = {}
            for i in range(len(labels)):
                labeldata = find_labeldata(labels[i]['id'])
                if not labeldata:
                    labeldata_to_save = LabelData(
                        id = labels[i]['id'],
                        image_id = image_id,
                        label_id = labels[i]['label_id']
                    )
                    new_labeldata = save_labeldata(labeldata_to_save)
                    for j in range(len(labels[i]['points'])):
                        point_to_save = Point(
                            id = labels[i]['points'][j]['id'],
                            labeldata_id = new_labeldata['id'],
                            x_coordinate = labels[i]['points'][j]['lat'],
                            y_coordinate = labels[i]['points'][j]['lng']
                        )
                        save_point(point_to_save)
                else:
                    labeldata_data = {
                        "label_id": labels[i]['label_id']
                    }
                    update_labeldata(labels[i]['id'], labeldata_data)
                    for point in labels[i]['points']:
                        point_data = {
                            "x_coordinate": point['lat'],
                            "y_coordinate": point['lng']
                        }
                        update_point(point['id'], point_data)
                labeldata = find_labeldata(labels[i]['id'])
                labeldata['label_type'] = labels[i]['label_type']
                new_labeldatas.append(labeldata)
                if res_labeldata.get(int(labeldata['label_id'])) is None:
                    res_labeldata[int(labeldata['label_id'])] = []
                res_labeldata[int(labeldata['label_id'])].append(labeldata)

            res_data = {
                "height": new_image['height'],
                "width": new_image['width'],
                "labelled": new_image['labelled'],
                "labeldata": res_labeldata,
                "project_id": project_id
            }
            response = {
                "success": True,
                "msg": "Labels updated.",
                "body": res_data
            }
            return make_response(jsonify(response)), 200
        
        except Exception as err:
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
    "delete_images": DeleteImages.as_view("delete_images"),
    "update_labels": UpdateLabels.as_view("update_labels")
}
