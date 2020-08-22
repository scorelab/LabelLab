enum LabelType { RECTANGLE, POLYGON }

class Label {
  String id;
  String name;
  LabelType type;
  String projectId;
  String count;
  DateTime createdAt;
  List<String> imageIds;

  Label({this.id, this.name, this.type});

  Label.fromJson(dynamic json) {
    id = json["id"].toString();
    name = json["label_name"];
    type =
        json["label_type"] == "bbox" ? LabelType.RECTANGLE : LabelType.POLYGON;
    projectId = json['project_id'].toString();
    count = json['count'].toString();
    imageIds = json['labeldata'] != null
        ? (json['labeldata']['id'] as List<dynamic>)
            .map((item) => item['image_id'])
        : [];
    // createdAt = DateTime.parse(json['created_at']);
  }

  Map<String, dynamic> toMap() {
    return {
      "label_name": name,
      "label_type": type == LabelType.RECTANGLE ? "bbox" : "polygon",
    };
  }
}
