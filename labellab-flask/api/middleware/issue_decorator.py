from functools import wraps
from flask import jsonify, make_response
from flask_jwt_extended import get_jwt_identity

from api.helpers.issue import find_by_id

def issue_exists(fun):
  @wraps(fun)
  def wrap(*args, **kwargs):

    # Get issue id
    issue_id = kwargs.get('issue_id')
    issue = find_by_id(issue_id)

    if not issue:
      response = {
        'success': False,
        'msg': 'Issue does not exist',
      }
      return make_response(jsonify(response)), 404

    return fun(*args, **kwargs)
  return wrap