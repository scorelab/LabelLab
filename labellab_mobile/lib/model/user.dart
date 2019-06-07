class User {
  String id;
  String name;
  String username;
  String email;

  User({this.id, this.name, this.username, this.email});

  User.fromJson(dynamic json) {
    id = json["_id"];
    name = json["name"];
    username = json["username"];
    email = json["email"];
  }
}
