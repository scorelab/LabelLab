from functools import wraps
from flask import jsonify, make_response
from flask_jwt_extended import get_jwt_identity

from api.helpers.project import find_by_project_id

def project_owner_only(fun):
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

    admin_id = project['admin_id']

    # If current user is not equal to project admin, then unauthorized
    if user_id != admin_id:
      response = {
        'success': False,
        'msg': 'Only project owner can access this route',
      }
      return make_response(jsonify(response)), 401

    # Else continue
    return fun(*args, **kwargs)
  return wrap