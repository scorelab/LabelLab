class User {
  String id;
  String name;
  String username;
  String email;
  String thumbnail;

  User({this.id, this.name, this.username, this.email});

  User.fromJson(dynamic json, {imageEndpoint}) {
    id = json["_id"];
    name = json["name"] != null ? json["name"] : json["username"];
    username = json["username"];
    email = json["email"];
    thumbnail = json["thumbnail"];
    if (thumbnail != null && !thumbnail.startsWith("http")) {
      thumbnail = (imageEndpoint != null ? imageEndpoint : "") + thumbnail;
    }
  }
}
