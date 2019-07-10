import 'package:labellab_mobile/model/user.dart';

class Member {
  String id;
  String role;
  User member;
  DateTime createdAt;

  Member({this.id, this.role, this.member, this.createdAt});

  Member.fromJson(dynamic json) {
    id = json["_id"];
    role = json["role"];
    if (!(json["member"] is String)) member = User.fromJson(json["member"]);
    createdAt = DateTime.parse(json["created_at"]);
  }
}
