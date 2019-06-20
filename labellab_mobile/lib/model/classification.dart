import 'package:labellab_mobile/model/user.dart';

class Classification {
  String id;
  User user;
  String imageUrl;
  String label;
  DateTime createdAt;

  Classification();

  Classification.fromJson(dynamic json) {
    id = json["_id"];
    user = User.fromJson(json['user']);
    imageUrl = json["image_url"];
    createdAt = DateTime.parse(json["created_at"]);
  }
}
