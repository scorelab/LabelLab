
import 'dart:math';
import 'package:labellab_mobile/model/label.dart';

class LabelSelection {
  final Label label;
  final List<Point> points = [];

  LabelSelection(this.label);

  void setStartPoint(Point point) {
    points.add(point);
    points.add(point);
    points.add(point);
    points.add(point);
  }

  void setEndPoint(Point point) {
    points.removeRange(points.length - 3, points.length);
    Point _start = points[0];
    points.add(Point(point.x, _start.y));
    points.add(Point(_start.x, point.y));
    points.add(Point(point.x, point.y));
  }

  void removePoint(Point point) {
    points.remove(point);
  }
}
