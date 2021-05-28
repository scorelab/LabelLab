import 'dart:io';

import 'package:labellab_mobile/model/label.dart';
import 'package:multi_image_picker/multi_image_picker.dart';

class UploadImageState {
  static const PENDING = 0;
  static const LOADING = 1;
  static const SUCCESS = 2;
  static const ERROR = 3;
}

class UploadImage {
  int? state;
  File? image;
  String? name;
  List<Label>? labels;
  Metadata? metadata;

  UploadImage({this.image, this.name, this.labels, this.metadata}) {
    this.state = UploadImageState.PENDING;
  }
}
