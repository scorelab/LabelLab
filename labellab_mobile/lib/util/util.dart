import 'package:flutter/widgets.dart';
import 'package:labellab_mobile/model/image.dart' as LabelLab;

class SelectionOffset {
  final double dx;
  final double dy;
  final double scale;

  static const zero = SelectionOffset(0, 0, 1);

  const SelectionOffset(this.dx, this.dy, this.scale);
}

SelectionOffset calculateImageOffset(LabelLab.Image image, Size size) {
  double scale;
  double xOffset;
  double yOffset;
  if ((size.width / size.height) > (image.width / image.height)) {
    scale = image.height / size.height;
    xOffset = (size.width - (image.width * scale)) / 2;
    yOffset = 0;
  } else {
    scale = image.width / size.width;
    xOffset = 0;
    yOffset = (size.height - (image.height * scale)) / 2;
  }
  return SelectionOffset(xOffset, yOffset, scale);
}
