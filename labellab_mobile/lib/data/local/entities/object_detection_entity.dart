
import 'package:labellab_mobile/model/object_detection.dart';

class ObjectDetectionEntity extends ObjectDetection {
  static const String table = 'object_detection';
  static const String columnId = '_id';
  static const String columnImageURL = 'image_url';

  ObjectDetectionEntity.from(ObjectDetection detection) {
    this.id = detection.id;
    this.imageUrl = detection.imageUrl;
  }

  ObjectDetectionEntity.fromMap(Map<String, dynamic> map) {
    id = map[columnId];
    imageUrl = map[columnImageURL];
  }

  Map<String, dynamic> toMap() {
    var map = <String, dynamic>{
      "image_url": imageUrl,
    };
    if (id != null) {
      map[columnId] = id;
    }
    return map;
  }
}
