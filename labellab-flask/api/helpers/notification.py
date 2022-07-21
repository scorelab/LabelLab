from sqlalchemy import desc

from api.extensions import db
from api.models.Notification import Notification
from api.serializers.notification import NotificationSchema

notification_schema = NotificationSchema()
notifications_schema = NotificationSchema(many =True)

# Fetch all notifications related to a user
def fetch_all_user_notifications(user_id):
  notifications = Notification.query.filter_by(user_id=user_id).all()
  return list(map(lambda notification: to_json(notification), notifications))

# Save a notification to db
def save_notification(notification):
  db.session.add(notification)
  db.session.commit()
  return notification_schema.dump(notification).data

def to_json(notification):
  return {
    'id': notification.id,
    'message': notification.message,
    'type': notification.type,
    'user_id': notification.user_id
  }
