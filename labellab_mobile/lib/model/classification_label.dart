
class ClassificationLabel {
  String id;
  String name;

  ClassificationLabel();

  ClassificationLabel.fromJson(dynamic json) {
    id = json["_id"];
    name = json["label_name"];
  }
}
