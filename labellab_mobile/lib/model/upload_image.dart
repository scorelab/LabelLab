import 'dart:io';

import 'package:labellab_mobile/model/label.dart';

class UploadImageState {
  static const PENDING = 0;
  static const LOADING = 1;
  static const SUCCESS = 2;
  static const ERROR = 3;
}

class UploadImage {
  int state;
  File image;
  List<Label> labels;

  UploadImage({this.image, this.labels}) {
    this.state = UploadImageState.PENDING;
  }
}
