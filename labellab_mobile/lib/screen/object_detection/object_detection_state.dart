
import 'package:labellab_mobile/model/object_detection.dart';

class ObjectDetectionState {
  bool isLoading;
  String error;
  ObjectDetection objectDetection;

  ObjectDetectionState.loading({this.objectDetection}) {
    isLoading = true;
  }

  ObjectDetectionState.error(this.error, {this.objectDetection}) {
    this.isLoading = false;
  }

  ObjectDetectionState.success(this.objectDetection) {
    this.isLoading = false;
  }
}