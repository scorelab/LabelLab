class Comment {
  int? id;
  String? body;
  int? issueId;
  int? userId;
  String? timestamp;
  String? thumbnail;
  String? username;

  Comment(
      {this.body,
      this.id,
      this.issueId,
      this.thumbnail,
      this.timestamp,
      this.userId,
      this.username});

    Comment.fromJson(dynamic json, {bool isDense = false}) {
    id = json['id'];
    body = json['body'];
    issueId = json['issue_id'];
    thumbnail = json['thumbnail'];
    timestamp = json['timestamp'];
    userId = json['user_id'];
    username = json['username'];
    
  }

  Map<String, dynamic> toMap() {
    return {
      "body": body,
    };
  }
}
