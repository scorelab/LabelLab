from functools import wraps
from flask import jsonify, make_response
from flask_jwt_extended import get_jwt_identity

from api.helpers.project import find_by_project_id
from api.helpers.user import get_user_roles

def image_only(fun):
  @wraps(fun)
  def wrap(*args, **kwargs):

    # Get current user
    user_id = get_jwt_identity()

    # Get project and admin_id
    project_id = kwargs.get('project_id')
    project = find_by_project_id(project_id)

    if not project:
      response = {
        'success': False,
        'msg': 'Project does not exist',
      }
      return make_response(jsonify(response)), 404

    user_roles = get_user_roles(user_id, project_id)

    # If current user does not have images or admin role, then unauthorized
    if 'admin' not in user_roles and 'images' not in user_roles:
      response = {
        'success': False,
        'msg': 'Only a images team member can access this route',
      }
      return make_response(jsonify(response)), 401

    # Else continue
    return fun(*args, **kwargs)
  return wrap