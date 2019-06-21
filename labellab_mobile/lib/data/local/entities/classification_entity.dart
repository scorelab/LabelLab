import 'package:labellab_mobile/model/classification.dart';

class ClassificationEntity extends Classification {
  static const String table = 'classification';
  static const String columnId = '_id';
  static const String columnImageURL = 'image_url';

  ClassificationEntity.from(Classification classification) {
    this.id = classification.id;
    this.imageUrl = classification.imageUrl;
  }

  ClassificationEntity.fromMap(Map<String, dynamic> map) {
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
