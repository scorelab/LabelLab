from sqlalchemy import desc

from api.extensions import db
from api.models.Log import Log

# Fetch all logs related to a project
def fetch_all_project_logs(project_id):
  logs = Log.query.filter_by(project_id=project_id).order_by(desc('timestamp')).all()
  return list(map(lambda log: to_json(log), logs))

# Fetch all project logs of a particular category
def fetch_all_category_logs(project_id, category):
  logs = Log.query.filter_by(project_id=project_id, category=category).order_by(desc('timestamp')).all()
  return list(map(lambda log: to_json(log), logs))

# Fetch all project logs of a particular project member
def fetch_all_user_logs(project_id, user_id):
  logs = Log.query.filter_by(project_id=project_id, user_id=user_id).order_by(desc('timestamp')).all()
  return list(map(lambda log: to_json(log), logs))

# Fetch all logs of a particular entity in a project
def fetch_all_entity_logs(project_id, entity_type, entity_id):
  logs = Log.query.filter_by(
    project_id=project_id,
    entity_type=entity_type, 
    entity_id=entity_id,
  ).order_by(desc('timestamp')).all()
  return list(map(lambda log: to_json(log), logs))

# Fetch last 5 logs of a project
def fetch_recent_project_logs(project_id):
  logs = Log.query.filter_by(project_id=project_id).order_by(desc('timestamp')).limit(5)
  return list(map(lambda log: to_json(log), logs))

# Save a log to db
def save_log(log):
  db.session.add(log)
  db.session.commit()

# Delete all project logs
def delete_all_project_logs(project_id):
  Log.query.filter_by(project_id=project_id).delete()
  db.session.commit()

# Return log model as json
def to_json(log):
  return {
    'id': log.id,
    'message': log.message,
    'category': log.category,
    'entity_id': log.entity_id,
    'entity_type': log.entity_type,
    'user_id': log.user_id,
    'username': log.username,
    'project_id': log.project_id,
    'timestamp': log.timestamp,
  }
