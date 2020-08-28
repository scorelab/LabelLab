import 'package:labellab_mobile/model/classification_label.dart';

class Classification {
  String id;
  String imageName;
  String imageUrl;
  List<ClassificationLabel> labels;
  DateTime createdAt;

  Classification();

  Classification.fromJson(dynamic json, {String staticEndpoint}) {
    id = json["id"].toString();
    imageName = json["image_name"];
    imageUrl = (staticEndpoint != null ? staticEndpoint : "") +
        json["user_id"].toString() +
        "/" +
        json["image_url"];
    createdAt = DateTime.parse(json["classified_at"]);
    labels = [
      ClassificationLabel.fromValues(
          name: json["label"], confidence: json["confidence"])
    ].toList();
  }
}
