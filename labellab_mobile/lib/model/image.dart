import 'package:labellab_mobile/model/label_selection.dart';

class Image {
  String id;
  String imageUrl;
  double width;
  double height;
  List<LabelSelection> labels;
  DateTime createdAt;

  Image({this.imageUrl, this.labels});

  Image.fromJson(dynamic json, {String imageEndpoint}) {
    id = json["_id"];
    imageUrl = (imageEndpoint != null ? imageEndpoint : "") + json["imageUrl"];
    width = double.parse(json["width"].toString());
    height = double.parse(json["height"].toString());
    if (json["labelData"] != null)
      labels = (json["labelData"] as List)
          .map((label) => LabelSelection.fromJson(label)).toList();
    createdAt = DateTime.parse(json["createdAt"]);
  }
}
