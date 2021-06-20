class TeamMember {
  String? id;
  String? name;
  String? email;
  String? username;

  TeamMember.fromJson(dynamic json) {
    id = json['id'].toString();
    name = json['name'];
    email = json['email'];
    username = json['username'];
  }
}
