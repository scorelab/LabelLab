class Label {
  String id;
  String name;
  String type;

  Label();

  Label.fromJson(dynamic json) {
    id = json["id"];
    name = json["name"];
    type = json["type"];
  }

  Map<String, dynamic> toMap() {
    return {
      "id": id,
      "name": name,
      "type": type,
    };
  }
}
