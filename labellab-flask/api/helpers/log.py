from api.extensions import db
from api.models.Log import Log

def save_log(log):
  db.session.add(log)
  db.session.commit()

def delete_all_project_logs(project_id):
  Log.query.filter_by(project_id=project_id).delete()
  db.session.commit()
