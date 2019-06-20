import 'label.dart';

class Classification {
  String id;
  String imageUrl;
  List<Label> label;
  DateTime createdAt;

  Classification();

  Classification.fromJson(dynamic json) {
    id = json["_id"];
    imageUrl = json["image_url"];
    createdAt = DateTime.parse(json["created_at"]);
    label =
        (json['label'] as List<dynamic>).map((label) => Label.fromJson(label)).toList();
  }
}
