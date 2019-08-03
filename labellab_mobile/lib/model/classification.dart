import 'package:labellab_mobile/model/classification_label.dart';

class Classification {
  String id;
  String imageUrl;
  List<ClassificationLabel> label;
  DateTime createdAt;

  Classification();

  Classification.fromJson(dynamic json, {String staticEndpoint}) {
    id = json["_id"];
    imageUrl = (staticEndpoint != null ? staticEndpoint : "") + json["imageUrl"];
    createdAt = DateTime.parse(json["createdAt"]);
    label = (json['label'] as List<dynamic>)
        .map((label) => ClassificationLabel.fromJson(label))
        .toList();
  }
}
