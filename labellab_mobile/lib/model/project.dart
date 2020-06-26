import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/member.dart';
import 'package:labellab_mobile/model/group.dart';

class Project {
  String id;
  String name;
  String description;
  List<Member> members;
  List<Image> images;
  List<Label> labels;
  List<Group> groups;

  Project(
      {this.id,
      this.name,
      this.description,
      this.members,
      this.images,
      this.labels,
      this.groups});

  Project.fromJson(dynamic json, {bool isDense = false, String imageEndpoint}) {
    id = json["_id"];
    name = json["projectName"];
    description = json["projectDescription"];
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
    if (json["groups"] != null && !isDense) {
      groups = (json["groups"] as List)
          .map((group) => Group.fromJson(group))
          .toList();
    } else {
      // Mock code to generate groups
      groups = [Group.mock(id, images)];
    }
  }

  Map<String, dynamic> toMap() {
    return {
      "projectName": name,
      "projectDescription": description,
    };
  }
}
