import 'dart:math';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:random_color/random_color.dart';

class LabelSelection {
  final Label label;
  final List<Point> points = [];
  final Color color;

  LabelSelection(this.label)
      : color = RandomColor().randomColor(
          colorBrightness: ColorBrightness.light,
        );

  void setStartPoint(Point point) {
    points.clear();
    points.add(point);
    points.add(point);
    points.add(point);
    points.add(point);
  }

  void setEndPoint(Point point) {
    points.removeRange(points.length - 3, points.length);
    Point _start = points[0];
    points.add(Point(point.x, _start.y));
    points.add(Point(point.x, point.y));
    points.add(Point(_start.x, point.y));
  }

  void appendPoint(Point point) {
    points.add(Point(point.x, point.y));
  }

  void removePoint(Point point) {
    points.remove(point);
  }
}
