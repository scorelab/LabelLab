import os
from api.config import config
from flask.views import MethodView
from flask import jsonify, make_response
from flask_jwt_extended import jwt_required

from api.helpers.log import (
  fetch_all_project_logs,
  fetch_all_category_logs,
  fetch_all_user_logs,
  fetch_all_entity_logs,
)
from api.middleware.project_member_access import project_member_only

allowed_categories = config[os.getenv("FLASK_CONFIG") or "development"].CATEGORIES_ALLOWED
allowed_entity_types = config[os.getenv("FLASK_CONFIG") or "development"].ENTITY_TYPES_ALLOWED

class FetchProjectLogsView(MethodView):
  '''
  This route fetches all logs related to a project
  /api/v1/logs/<int:project_id>
  '''
  @jwt_required
  @project_member_only
  def get(self, project_id):
    project_logs = fetch_all_project_logs(project_id)
    response = {
      'success': True,
      'data': project_logs,
    }
    return make_response(jsonify(response)), 200

class FetchCategoryLogsView(MethodView):
  '''
  This route fetches all project logs of a particular category
  /api/v1/logs/<int:project_id>/category/<string:category>
  '''
  @jwt_required
  @project_member_only
  def get(self, project_id, category):
    if category not in allowed_categories:
      response = {
        'success': False,
        'msg': 'Invalid category'
      }
      return make_response(jsonify(response)), 400
      
    category_logs = fetch_all_category_logs(project_id, category)
    response = {
      'success': True,
      'data': category_logs,
    }
    return make_response(jsonify(response)), 200

class FetchUserLogsView(MethodView):
  '''
  This route fetches all project logs of a particular project member
  /api/v1/logs/<int:project_id>/user/<int:user_id>
  '''
  @jwt_required
  def get(self, project_id, user_email):
    user_logs = fetch_all_user_logs(project_id, user_email)
    response = {
      'success': True,
      'data': user_logs,
    }
    return make_response(jsonify(response)), 200

class FetchEntityLogsView(MethodView):
  '''
  This route fetches all logs of a particular entity in the project
  /api/v1/logs/<int:project_id>/entity/<string:entity_type>/<int:entity_id>
  '''
  @jwt_required
  @project_member_only
  def get(self, project_id, entity_type, entity_id):
    if entity_type not in allowed_entity_types:
      response = {
        'success': False,
        'msg': 'Invalid entity type'
      }
      return make_response(jsonify(response)), 400

    entity_logs = fetch_all_entity_logs(project_id, entity_type, entity_id)
    response = {
      'success': True,
      'data': entity_logs,
    }
    return make_response(jsonify(response)), 200

logs_controller = {
  'fetch_project_logs': FetchProjectLogsView.as_view('fetch_project_logs'),
  'fetch_category_logs': FetchCategoryLogsView.as_view('fetch_category_logs'),
  'fetch_user_logs': FetchUserLogsView.as_view('fetch_user_logs'),
  'fetch_entity_logs': FetchEntityLogsView.as_view('fetch_entity_logs'),
}
