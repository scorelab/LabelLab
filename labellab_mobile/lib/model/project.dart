import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/member.dart';
import 'package:labellab_mobile/model/group.dart';
import 'package:labellab_mobile/model/ml_model.dart';

class Project {
  String id;
  String adminId;
  String name;
  String description;
  List<Member> members;
  List<Image> images;
  List<Label> labels;
  List<Group> groups;
  List<MlModel> models;

  Project(
      {this.id,
      this.adminId,
      this.name,
      this.description,
      this.members,
      this.images,
      this.labels,
      this.groups});

  Project.fromJson(dynamic json, {bool isDense = false, String imageEndpoint}) {
    id = json["id"].toString();
    adminId = json["admin_id"].toString();
    name = json["project_name"];
    description = json["project_description"];
    if (json["members"] != null && !isDense) {
      members = (json["members"] as List)
          .map(
            (member) => Member.fromJson(member),
          )
          .toList();
    }
    if (json["images"] != null && !isDense) {
      images = (json["images"] as List)
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
    groups = [];
    // if (json["groups"] != null && !isDense) {
    //   groups = (json["groups"] as List)
    //       .map((group) => Group.fromJson(group))
    //       .toList();
    // }
  }

  Map<String, dynamic> toMap() {
    return {
      "project_name": name,
      "project_description": description,
    };
  }
}
