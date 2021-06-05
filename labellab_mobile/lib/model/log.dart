class Log {
  int? id;
  String? message;
  String? category;
  int? userId;
  String? username;
  int? projectId;
  String? timestamp;
  int? entityId;
  String? entityType;

  Log(
    int id,
    String message,
    String category,
    int userId,
    String username,
    int projectId,
    String timestamp,
    int entityId,
    String entityType,
  ) {
    this.id = id;
    this.message = message;
    this.category = category;
    this.userId = userId;
    this.username = username;
    this.projectId = projectId;
    this.timestamp = timestamp;
    this.entityId = entityId;
    this.entityType = entityType;
  }

  Log.fromJSON(Map<String, dynamic> data) {
    id = data['id'];
    message = data['message'];
    category = data['category'];
    userId = data['user_id'];
    username = data['username'];
    projectId = data['project_id'];
    timestamp = data['timestamp'];
    entityId = data['entity_id'] != null ? data['entity_id'] : null;
    entityType = data['entity_type'] != null ? data['entity_type'] : null;
  }

  Map<String, dynamic> toMap() {
    return {
      'id': this.id,
      'message': this.message,
      'category': this.category,
      'project_id': this.projectId,
      'user_id': this.userId,
      'username': this.username,
      'entity_type': this.entityType,
      'entity_id': this.entityId,
    };
  }
}
