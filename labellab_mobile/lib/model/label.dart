class LabelType {
  static const RECTANGLE = "Rectangle";
  static const POLYGON = "Polygon";
}

class Label {
  String labelID;
  String id;
  String name;
  String type;

  Label({this.id, this.name, this.type, this.labelID});

  Label.fromJson(dynamic json) {
    labelID = json["_id"];
    id = json["id"];
    name = json["name"];
    type = json["type"];
  }

  Map<String, dynamic> toMap() {
    return {
      "_id": labelID,
      "id": id,
      "name": name,
      "type": type,
    };
  }
}
