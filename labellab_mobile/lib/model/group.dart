import 'package:labellab_mobile/model/image.dart';

class Group {
  String id;
  String name;
  String projectId;
  List<Image> images;

  Group({this.id, this.name, this.projectId, this.images});

  Group.fromJson(dynamic json) {
    id = json["_id"];
    name = json["groupName"];
    projectId = json["projectId"];
    images =
        (json["images"] as List).map((image) => Image.fromJson(image)).toList();
  }

  Map<String, dynamic> toMap() {
    return {
      "groupName": name,
      "projectId": projectId,
    };
  }

  // Creates a mock group for testing
  Group.mock(this.projectId, this.images) {
    id = "thisisarandomid";
    name = "Test group 1";
  }
}
