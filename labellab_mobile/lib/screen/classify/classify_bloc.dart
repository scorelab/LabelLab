import 'dart:async';
import 'dart:io';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/screen/classify/classify_state.dart';

class ClassifyBloc {
  Repository _repository = Repository();

  File _image;
  bool _isClassifing = false;

  StreamSubscription<Classification> _uploadProcess;

  ClassifyBloc();


  void classifyImage(File image) {
    if (!_isClassifing && image != null) {
      _image = image;
      _isClassifing = true;
      _stateController.add(ClassifyState.loading(image: image));
      _uploadProcess =
          _classify(image).asStream().listen((Classification classification) {
        _isClassifing = false;
        _stateController
            .add(ClassifyState.classified(classification, image: image));
      });
      _uploadProcess.onError((err) {
        _isClassifing = false;
        _stateController.add(ClassifyState.error(err.toString(), image: image));
      });
    }
  }

  void retry() {
    classifyImage(_image);
  }

  void cancel() {
    if (_isClassifing) {
      _uploadProcess.cancel();
    }
  }

  // State stream
  StreamController<ClassifyState> _stateController =
      StreamController<ClassifyState>();

  Stream<ClassifyState> get state => _stateController.stream;

  Future<Classification> _classify(File image) {
    return _repository.classify(image);
  }

  void dispose() {
    if (_uploadProcess != null) _uploadProcess.cancel();
    _stateController.close();
  }
}
