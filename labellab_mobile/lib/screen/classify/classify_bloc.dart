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
      _classifyController.add(ClassifyState.loading(image: image));
      _uploadProcess =
          _classify(image).asStream().listen((Classification classification) {
        _isClassifing = false;
        _classifyController.add(ClassifyState.classified(classification, image: image));
      });
      _uploadProcess.onError((err) {
        _isClassifing = false;
        _classifyController
            .add(ClassifyState.error(err.toString(), image: image));
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

  // Classify stream
  StreamController<ClassifyState> _classifyController =
      StreamController<ClassifyState>();

  Stream<ClassifyState> get state => _classifyController.stream;

  Future<Classification> _classify(File image) {
    // TODO - Remove mock result and integrate with the backend
    return Future.delayed(Duration(seconds: 5), () {
      Classification mockClassification = Classification();
      mockClassification.id = "483594220985";
      return mockClassification;
    });
  }

  void dispose() {
    _uploadProcess.cancel();
    _classifyController.close();
  }
}
