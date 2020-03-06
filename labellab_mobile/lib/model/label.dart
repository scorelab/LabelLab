class LabelType {
  static const RECTANGLE = "Rectangle";
  static const POLYGON = "Polygon";
}

class Label {
  String id;
  String name;
  String type;
  String mongoId;

  Label({this.id, this.name, this.type, this.mongoId});

  Label.fromJson(dynamic json) {
    id = json["id"];
    name = json["name"];
    type = json["type"];
    mongoId = json["_id"];
  }

  Map<String, dynamic> toMap() {
    return {
      "_id": mongoId,
      "id": id,
      "name": name,
      "type": type,
    };
  }
}
