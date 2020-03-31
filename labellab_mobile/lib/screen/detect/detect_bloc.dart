import 'dart:async';
import 'dart:io';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/model/object_detection.dart';
import 'package:labellab_mobile/screen/classify/classify_state.dart';
import 'package:labellab_mobile/screen/detect/detect_state.dart';

class DetectBloc {
  Repository _repository = Repository();

  File _image;
  bool _isDetecting = false;

  StreamSubscription<ObjectDetection> _uploadProcess;

  DetectBloc();

  void setImage(File image) {
    _image = image;
    _stateController.add(DetectState.setImage(image: image));
  }

  void detectImage(File image) {
    if (!_isDetecting && image != null) {
      _image = image;
      _isDetecting = true;
      _stateController.add(DetectState.loading(image: image));
      _uploadProcess =
          _detect(image).asStream().listen((ObjectDetection objectDetection) {
            _isDetecting = false;
            _stateController
                .add(DetectState.detected(objectDetection, image: image));
          });
      _uploadProcess.onError((err) {
        _isDetecting = false;
        _stateController.add(DetectState.error(err.toString(), image: image));
      });
    }
  }

  void retry() {
    detectImage(_image);
  }

  void cancel() {
    if (_isDetecting) {
      _uploadProcess.cancel();
    }
  }

  // State stream
  StreamController<DetectState> _stateController =
  StreamController<DetectState>();

  Stream<DetectState> get state => _stateController.stream;

  Future<ObjectDetection> _detect(File image) {
    return _repository.detect(image);
  }

  void dispose() {
    if (_uploadProcess != null) _uploadProcess.cancel();
    _stateController.close();
  }
}
