import 'dart:async';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/object_detection.dart';
import 'package:labellab_mobile/screen/history/object_detection_history_state.dart';

class ObjectDetectionHistoryBloc {
  Repository _repository = Repository();

  List<ObjectDetection> _objectDetections;
  bool _isLoading = false;

  ObjectDetectionHistoryBloc() {
    _loadObjectDetections();
  }

  void refresh() {
    _loadObjectDetections();
  }

  Future delete(String id) {
    _setState(ObjectDetectionHistoryState.loading(objectDetections: _objectDetections));
    return _repository.deleteDetection(id).then((success) {
      if (success) _loadObjectDetections();
    });
  }

  // Classification stream
  StreamController<ObjectDetectionHistoryState> _objectDetectionController =
      StreamController<ObjectDetectionHistoryState>();

  Stream<ObjectDetectionHistoryState> get objectDetections => _objectDetectionController.stream;

  void _loadObjectDetections() {
    if (_isLoading) return;
    _isLoading = true;
    _objectDetectionController
        .add(ObjectDetectionHistoryState.loading(objectDetections: _objectDetections));
    _repository.getDetectionsLocal().then((objectDetections) {
      this._objectDetections = objectDetections;
      _setState(ObjectDetectionHistoryState.loading(objectDetections: _objectDetections));
    });
    _repository.getDetections().then((objectDetections) {
      this._objectDetections = objectDetections;
      _setState(ObjectDetectionHistoryState.success(_objectDetections));
      _isLoading = false;
    }).catchError((err) {
      if (err is DioError) {
        _setState(ObjectDetectionHistoryState.error(err.message.toString(),
            objectDetections: _objectDetections));
      } else {
        _setState(ObjectDetectionHistoryState.error(err.toString(),
            objectDetections: _objectDetections));
      }
      _isLoading = false;
    });
  }

  _setState(ObjectDetectionHistoryState state) {
    if (!_objectDetectionController.isClosed)
      _objectDetectionController.add(state);
  }

  void dispose() {
    _objectDetectionController.close();
  }
}
