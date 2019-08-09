import 'dart:math';

import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/label_selection.dart';
import 'package:labellab_mobile/model/image.dart' as LabelLab;
import 'package:labellab_mobile/util/util.dart';

typedef void SizeCallback(Size size);

class LabelSelectionPainter extends CustomPainter {
  final List<LabelSelection> labelSelections;
  final LabelSelection current;
  final LabelLab.Image image;
  final SizeCallback sizeCallback;
  Size _size;

  LabelSelectionPainter(this.labelSelections, this.current, this.image,
      {this.sizeCallback});

  @override
  void paint(Canvas canvas, Size size) {
    if (sizeCallback != null) {
      if (_size == null || _size != size) {
        _size = size;
        sizeCallback(_size);
      }
    }

    final SelectionOffset selectionOffset = calculateImageOffset(image, size);

    for (var labelSelection in labelSelections) {
      drawPath(canvas, labelSelection.color, labelSelection.points,
          offset: labelSelection.isAdjusted
              ? selectionOffset
              : SelectionOffset.zero,
          withVertices: false);
    }
    if (current != null) {
      drawPath(canvas, Colors.blue, current.points);
    }
  }

  @override
  bool shouldRepaint(LabelSelectionPainter oldDelegate) => true;

  void drawPath(Canvas canvas, Color color, List<Point> points,
      {SelectionOffset offset = SelectionOffset.zero,
      bool withVertices = true}) {
    if (points.length > 0) {
      final paint = Paint();
      final paintStroke = Paint();

      paint.color = color;
      paintStroke.color = color;
      paintStroke.style = PaintingStyle.stroke;
      paintStroke.strokeWidth = 4;

      final path = Path();
      if (withVertices) {
        for (var point in points) {
          canvas.drawCircle(
              Offset(point.x / offset.scale + offset.dx,
                  point.y / offset.scale + offset.dy),
              6,
              paint);
        }
      }

      path.moveTo(points[0].x / offset.scale + offset.dx,
          points[0].y / offset.scale + offset.dy);
      for (var point in points) {
        path.lineTo(point.x / offset.scale + offset.dx,
            point.y / offset.scale + offset.dy);
      }
      path.lineTo(points[0].x / offset.scale + offset.dx,
          points[0].y / offset.scale + offset.dy);

      canvas.drawPath(path, paintStroke);
    }
  }
}
