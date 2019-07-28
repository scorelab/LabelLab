import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/member.dart';

class Project {
  String id;
  String name;
  String description;
  List<Member> members;
  List<Image> images;
  List<Label> labels;

  Project(
      {this.id,
      this.name,
      this.description,
      this.members,
      this.images,
      this.labels});

  Project.fromJson(dynamic json, {bool isDense = false, String imageEndpoint}) {
    id = json["_id"];
    name = json["project_name"];
    description = json["project_description"];
    if (json["members"] != null && !isDense) {
      members = (json["members"] as List)
          .map(
            (member) => Member.fromJson(member),
          )
          .toList();
    }
    if (json["image"] != null && !isDense) {
      images = (json["image"] as List)
          .map(
            (image) => Image.fromJson(image, imageEndpoint: imageEndpoint),
          )
          .toList();
    }
    if (json["labels"] != null && !isDense) {
      labels = (json["labels"] as List)
          .map(
            (label) => Label.fromJson(label),
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
