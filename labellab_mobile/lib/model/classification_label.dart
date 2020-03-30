
class ClassificationLabel {
  String id;
  String name;
  int accuracy;

  ClassificationLabel();

  ClassificationLabel.fromJson(dynamic json) {
    id = json["_id"];
    name = json["label_name"];
    accuracy = json["accuracy"] ?? 0;
  }
}
