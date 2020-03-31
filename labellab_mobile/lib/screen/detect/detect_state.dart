import 'dart:io';

import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/model/object_detection.dart';

class DetectState {
  bool isDetecting;
  ObjectDetection objectDetection;
  String error;
  File image;

  DetectState.initial() {
    isDetecting = false;
  }

  DetectState.loading({this.image}) {
    isDetecting = true;
  }

  DetectState.setImage({this.image}) {
    isDetecting = false;
  }

  DetectState.error(this.error, {this.image}) {
    isDetecting = false;
  }

  DetectState.detected(this.objectDetection, {this.image}) {
    isDetecting = false;
  }
}