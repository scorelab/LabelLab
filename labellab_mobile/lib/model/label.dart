class Label {
  String id;
  String labelName;
  double startX;
	double endX;
	double startY;
	double endY;

  Label();

  Label.fromJson(dynamic json) {
    id = json["_id"];
    labelName = json["label_name"];
    startX = json["startX"];
    endX = json["endX"];
    startY = json["startY"];
    endY = json["endY"];
  }
}
