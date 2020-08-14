import 'package:labellab_mobile/model/label_selection.dart';
import 'package:logger/logger.dart';

class Image {
  String id;
  String imageUrl;
  String name;
  double width;
  double height;
  List<LabelSelection> labels;
  bool isLabeled;

  Image({this.imageUrl, this.labels});

  Image.fromJson(dynamic json, {String imageEndpoint}) {
    id = json["id"].toString();
    name = json['image_name'];
    imageUrl = (imageEndpoint != null ? imageEndpoint : "") +
        json['project_id'].toString() +
        "/" +
        json["image_url"];
    width = double.parse(json["width"].toString());
    height = double.parse(json["height"].toString());
    isLabeled = json['labelled'];
    if (json["labelData"] != null)
      labels = (json["labelData"] as List)
          .map((label) => LabelSelection.fromJson(label))
          .toList();

    Logger().i(name);
  }
}
