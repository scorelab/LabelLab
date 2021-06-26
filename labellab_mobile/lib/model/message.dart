class Message {
  String? id;
  String? body;
  String? teamId;
  String? userId;
  String? username;
  String? timestamp;

  Message.fromJson(Map<String, dynamic> json) {
    id = json['id'].toString();
    body = json['body'];
    teamId = json['team_id'].toString();
    userId = json['user_id'].toString();
    username = json['username'];
    timestamp = json['timestamp'];
  }
}
