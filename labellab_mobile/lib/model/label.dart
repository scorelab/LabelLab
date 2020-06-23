class LabelType {
  static const RECTANGLE = "Rectangle";
  static const POLYGON = "Polygon";
}

class Label {
  String id;
  String name;
  String type;

  Label({this.id, this.name, this.type});

  Label.fromJson(dynamic json) {
    id = json["_id"];
    name = json["name"];
    type = json["type"];
  }

  Map<String, dynamic> toMap() {
    return {
      "_id": id,
      "name": name,
      "type": type,
    };
  }
}
