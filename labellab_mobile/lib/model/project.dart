import 'package:labellab_mobile/model/member.dart';

class Project {
  String id;
  String name;
  String description;
  List<Member> members;

  Project({this.id, this.name, this.description, this.members});

  Project.fromJson(dynamic json) {
    id = json["_id"];
    name = json["project_name"];
    description = json["project_description"];
    if (json["members"] != null) {
      members = (json["members"] as List)
          .map(
            (member) => Member.fromJson(member),
          )
          .toList();
    }
  }

  Map<String, dynamic> toMap() {
    return {
      "project_name": name,
      "project_description": description,
    };
  }
}
