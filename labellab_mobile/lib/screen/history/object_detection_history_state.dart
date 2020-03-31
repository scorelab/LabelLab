import 'package:labellab_mobile/model/object_detection.dart';

class ObjectDetectionHistoryState {
  bool isLoading;
  String error;
  List<ObjectDetection> objectDetections;

  ObjectDetectionHistoryState.loading({this.objectDetections}) {
    isLoading = true;
  }

  ObjectDetectionHistoryState.error(this.error, {this.objectDetections}) {
    this.isLoading = false;
  }

  ObjectDetectionHistoryState.success(this.objectDetections) {
    this.isLoading = false;
  }
}