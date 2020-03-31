import 'package:labellab_mobile/model/detection.dart';

class ObjectDetection {
  String id;
  String imageUrl;
  List<Detection> detections;
  DateTime createdAt;

  ObjectDetection();

  ObjectDetection.fromJson(dynamic json, {String staticEndpoint}) {
    id = json["_id"];
    imageUrl = (staticEndpoint != null ? staticEndpoint : "") + json["imageUrl"];
    createdAt = DateTime.parse(json["createdAt"]);
    detections = (json['detections'] as List<dynamic>)
        .map((label) => Detection.fromJson(label))
        .toList();
  }
}
