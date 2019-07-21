import 'package:labellab_mobile/model/label.dart';

class Image {
  String id;
  String imageUrl;
  List<Label> labels;
  DateTime createdAt;

  Image({this.imageUrl, this.labels});

  Image.fromJson(dynamic json, {String imageEndpoint}) {
    id = json["_id"];
    imageUrl = (imageEndpoint != null ? imageEndpoint : "") + json["image_url"];
    if (json["labelled"])
      labels = (json["label"] as List).map((label) => Label.fromJson(label));
    createdAt = DateTime.parse(json["created_at"]);
  }
}
