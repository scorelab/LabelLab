class Project {
  String id;
  String name;

  Project({this.id, this.name});

  Project.fromJson(dynamic json) {
    id = json["_id"];
    name = json["project_name"];
  }

  Map<String, dynamic> toMap() {
    return {
      "project_name": name
    };
  }
}
