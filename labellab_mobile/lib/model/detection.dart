
class Detection {
  String id;
  String name;
  int confidence;
  int x1;
  int y1;
  int x2;
  int y2;

  Detection();

  Detection.fromJson(dynamic json) {
    id = json["_id"];
    name = json["label_name"];
    confidence = json["confidence"];
    x1 = json["x1"];
    y1 = json["y1"];
    x2 = json["x2"];
    y2 = json["y2"];
  }
}
