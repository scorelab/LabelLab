from flask import request
from functools import wraps
from flask_jwt_extended import get_jwt_identity

from api.models.Log import Log
from api.helpers.log import (
  save_log,
  delete_all_project_logs,
)
from api.helpers.user import (
  find_by_user_id,
  find_by_email,
)
from api.helpers.team import find_by_id as find_team_by_id
from api.helpers.label import find_by_id as find_label_by_id
from api.helpers.issue import find_by_id as find_issue_by_id
from api.helpers.mlclassifier import find_by_id as find_mlclassifer_by_id
from api.helpers.project import find_by_project_id

# Use this decorator on project routes for tracking activity
def record_logs(fun):
  @wraps(fun)
  def wrap(*args, **kwargs):
    
    try:
      result = fun(*args, **kwargs)
      status_code = int(result[1])
      
      # If unsuccessful request then no need to store log
      if status_code != 200 and status_code != 201:
        return result

      # Get user details
      user_id = get_jwt_identity()
      user = find_by_user_id(user_id)

      # Get url, method and project id
      url = request.path
      method = request.method
      project_id = kwargs.get('project_id') if kwargs.get('project_id') else -1

      # Initialize with default values
      message = url
      category = 'misc'
      entity_type = None
      entity_id = None

      # Projects controller
      if url == f'/api/v1/project/project_info/{project_id}':
        if method == 'PUT':
          # Edit Project
          message = f'Project details edited by {user["username"]}'
          category = 'general'
        elif method == 'DELETE':
          # Delete Project
          # In this case, delete all project related logs
          delete_all_project_logs(project_id)
          return result

      if url == f'/api/v1/project/add_project_member/{project_id}':
        # Add Project Member
        data = request.get_json(silent=True, force=True)
        member_email = data['member_email']
        member = find_by_email(member_email)
        message = f'{member.username} has been added to the project'
        category = 'general'

      if url == f'/api/v1/project/remove_project_member/{project_id}':
        data = request.get_json(silent=True, force=True)
        member_email = data['member_email']
        member = find_by_email(member_email)
        message = f'{member.username} has been removed from the project'
        category = 'general'

      if url == f'/api/v1/project/leave/{project_id}':
        message = f'{user["username"]} has left the project'
        category = 'general'

      if url == f'/api/v1/project/make_admin/{project_id}':
        message = f'{user["username"]} has been made admin'
        category = 'general'

      if url == f'/api/v1/project/remove_admin/{project_id}':
        message = f'{user["username"]} has been removed as admin'
        category = 'general'

      # Teams controller
      if url.startswith(f'/api/v1/team/team_info/{project_id}/'):
        team_id = kwargs.get('team_id')
        team = find_team_by_id(team_id)
        if method == 'PUT':
          # Update Team
          message = f'Team {team["team_name"]} has been updated'
          category = 'general'
        elif method == 'DELETE':
          # Delete Team
          message = f'Team with id {team_id} has been deleted'
          category = 'general'
      
      if url.startswith(f'/api/v1/team/add_team_member/{project_id}'):
        team_id = kwargs.get('team_id')
        team = find_team_by_id(team_id)
        data = request.get_json(silent=True, force=True)
        member_email = data['member_email']
        member = find_by_email(member_email)

        message = f'{member.username} has been added to team {team["team_name"]}'
        category = 'general'

      if url.startswith(f'/api/v1/team/remove_team_member/{project_id}'):
        team_id = kwargs.get('team_id')
        team = find_team_by_id(team_id)
        data = request.get_json(silent=True, force=True)
        member_email = data['member_email']
        member = find_by_email(member_email)

        message = f'{member.username} has been removed from team {team["team_name"]}'
        category = 'general'

      # Images controller
      if url.startswith(f'/api/v1/image/create/{project_id}'):
        message = 'New image has been added to project'
        category = 'images'
      
      if url.startswith(f'/api/v1/image/delete/{project_id}'):
        message = 'Image(s) have been deleted from the project'
        category = 'images'

      if url.startswith(f'/api/v1/image/update/'):
        image_id = kwargs.get('image_id')
        data = request.get_json(silent=True, force=True)

        message = f'Labels for image with id {image_id} have been updated'
        project_id = data['project_id']
        category = 'image labelling'
        entity_id = image_id
        entity_type = 'image'

      # Issues controller
      if url == f'/api/v1/issue/create/{project_id}':
        message = 'New issue has been created'
        category = 'issues'
      
      if url.startswith('/api/v1/issue/issue_info/'):
        issue_id = kwargs.get('issue_id')
        if method == 'DELETE':
          message = f'Issue with id {issue_id} has been deleted'
          category = 'issues'
        elif method == 'PUT':
          issue = find_issue_by_id(issue_id)
          message = f'Issue {issue["title"]} has been updated'
          category = 'issues'
          entity_type = 'issue'
          entity_id = issue_id

      if url.startswith('/api/v1/issue/assign/'):
        issue_id = kwargs.get('issue_id')
        data = request.get_json(silent=True, force=True)
        assignee_id = data['assignee_id']
        user = find_by_user_id(assignee_id)
        issue = find_issue_by_id(issue_id)
        message = f'Issue {issue["title"]} assigned to {user["name"]}'
        category = 'issues'
     
      # Comment controller
      if url.startswith('/api/v1/comment/create/'):
        issue_id = kwargs.get('issue_id')
        issue = find_issue_by_id(issue_id)
        project_id = issue['project_id']
        project = find_by_project_id(project_id)
        message = f'{user["username"]} posted a new comment on {project["project_name"]}'
        category = 'comments'
        

      # Labels controller
      if url == f'/api/v1/label/create/{project_id}':
        message = 'New label has been created'
        category = 'labels'
      
      if url.startswith('/api/v1/label/label_info/'):
        label_id = kwargs.get('label_id')
        if method == 'DELETE':
          message = f'Label with id {label_id} has been deleted'
          category = 'labels'
        elif method == 'PUT':
          label = find_label_by_id(label_id)
          message = f'Label {label["label_name"]} has been updated'
          category = 'labels'
          entity_type = 'label'
          entity_id = label_id

      # MLClassifications controller
      if url == '/api/v1/mlclassifier':
        data = request.get_json(silent=True, force=True)
        project_id = data['projectId']

        message = f'New model {data["name"]} has been created'
        category = 'models'
      
      ml_classifier_id = kwargs.get('mlclassifier_id') if kwargs.get('mlclassifier_id') else -1
      
      if url == f'/api/v1/mlclassifier/{ml_classifier_id}':
        if method == 'PUT':
          ml_classifier = find_mlclassifer_by_id(ml_classifier_id)
          project_id = ml_classifier['project_id']

          message = f'Model {ml_classifier["name"]} has been updated'
          category = 'models'
          entity_id = ml_classifier_id
          entity_type = 'model'
        elif method == 'DELETE':
          message = f'Model with id {ml_classifier_id} has been deleted'
          category = 'models'
      
      if url == f'/api/v1/mlclassifer/upload/{ml_classifier_id}':
        ml_classifier = find_mlclassifer_by_id(ml_classifier_id)
        project_id = ml_classifier['project_id']

        message = f'Model {ml_classifier["name"]} has been uploaded'
        category = 'models'
        entity_id = ml_classifier_id
        entity_type = 'model'

      if url.startswith(f'/api/v1/mlclassifer/export'):
        ml_classifier = find_mlclassifer_by_id(ml_classifier_id)
        project_id = ml_classifier['project_id']

        message = f'Model {ml_classifier["name"]} has been exported'
        category = 'models'
        entity_id = ml_classifier_id
        entity_type = 'model'

      if url == f'/api/v1/mlclassifer/test/{ml_classifier_id}':
        ml_classifier = find_mlclassifer_by_id(ml_classifier_id)
        project_id = ml_classifier['project_id']

        message = f'Model {ml_classifier["name"]} is being tested'
        category = 'models'
        entity_id = ml_classifier_id
        entity_type = 'model'

      if url == f'/api/v1/mlclassifer/train/{ml_classifier_id}':
        ml_classifier = find_mlclassifer_by_id(ml_classifier_id)
        project_id = ml_classifier['project_id']

        message = f'Model {ml_classifier["name"]} is being trained'
        category = 'models'
        entity_id = ml_classifier_id
        entity_type = 'model'

      log = Log(
        message=message, 
        category=category, 
        user_id=user_id, 
        project_id=project_id,
        entity_type=entity_type,
        entity_id=entity_id,
        username=user['username'],
      )
      save_log(log)

      return result
    
    except Exception as e:
      print('Error - ', str(e))
      return fun(*args, **kwargs)
  return wrap