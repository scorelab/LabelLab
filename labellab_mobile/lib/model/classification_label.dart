class ClassificationLabel {
  String id;
  String name;
  double confidence;

  ClassificationLabel();

  ClassificationLabel.fromJson(dynamic json) {
    id = json["_id"];
    name = json["label_name"];
    confidence = json["confidence"] ?? 0;
  }

  ClassificationLabel.fromValues({this.name, this.confidence});
}
