import 'dart:async';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/object_detection.dart';
import 'package:labellab_mobile/screen/object_detection/object_detection_state.dart';

class ObjectDetectionBloc {
  Repository _repository = Repository();

  String objectDetectionId;
  ObjectDetection _objectDetection;
  bool _isLoading = false;

  ObjectDetectionBloc(this.objectDetectionId) {
    _loadObjectDetection();
  }

  void refresh() {
    _loadObjectDetection();
  }

  Future delete() {
    return _repository.deleteDetection(objectDetectionId);
  }

  // ObjectDetection state stream
  StreamController<ObjectDetectionState> _objectDetectionController =
  StreamController<ObjectDetectionState>();

  Stream<ObjectDetectionState> get state => _objectDetectionController.stream;

  void _loadObjectDetection() {
    if (_isLoading) return;
    _isLoading = true;
    _objectDetectionController
        .add(ObjectDetectionState.loading(objectDetection: _objectDetection));
    _repository.getDetectionLocal(objectDetectionId).then((objectDetection) {
      this._objectDetection = objectDetection;
      _setState(ObjectDetectionState.loading(objectDetection: _objectDetection));
    });
    _repository.getDetection(objectDetectionId).then((objectDetection) {
      this._objectDetection = objectDetection;
      _setState(ObjectDetectionState.success(_objectDetection));
      _isLoading = false;
    }).catchError((err) {
      if (err is DioError) {
        _setState(ObjectDetectionState.error(err.message.toString(),
            objectDetection: _objectDetection));
      } else {
        print(err);
        _setState(ObjectDetectionState.error(err.toString(),
            objectDetection: _objectDetection));
      }
      _isLoading = false;
    });
  }

  _setState(ObjectDetectionState state) {
    if (!_objectDetectionController.isClosed)
      _objectDetectionController.add(state);
  }

  void dispose() {
    _objectDetectionController.close();
  }
}
