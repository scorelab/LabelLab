from functools import wraps
from flask import jsonify, make_response
from flask_jwt_extended import get_jwt_identity

from api.helpers.comment import find_by_id

def comment_exists(fun):
  @wraps(fun)
  def wrap(*args, **kwargs):

    # Get comment id
    comment_id = kwargs.get('comment_id')
    comment = find_by_id(comment_id)

    if not comment:
      response = {
        'success': False,
        'msg': 'comment does not exist',
      }
      return make_response(jsonify(response)), 404

    return fun(*args, **kwargs)
  return wrap