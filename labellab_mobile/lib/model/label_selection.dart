import 'dart:math';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:random_color/random_color.dart';

class LabelSelection {
  final Label label;
  final List<Point> points;
  final Color color;
  final bool isAdjusted;

  LabelSelection(this.label)
      : points = [],
        color = RandomColor().randomColor(
          colorBrightness: ColorBrightness.light,
        ),
        isAdjusted = false;

  LabelSelection.adjusted(this.label, this.points, this.color)
      : isAdjusted = true;

  LabelSelection.fromJson(dynamic json)
      : label = Label.fromJson(json),
        points = (json["points"] as List).map((label) {
          return Point<double>(label["lat"], label["lng"]);
        }).toList(),
        color = RandomColor().randomColor(
          colorBrightness: ColorBrightness.light,
        ),
        isAdjusted = true;

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

  Map<String, dynamic> toMap() {
    Map<String, dynamic> map = label.toMap();
    map["points"] = points.map((point) {
      return {
        "lat": point.x,
        "lng": point.y,
      };
    }).toList();
    return map;
  }
}
