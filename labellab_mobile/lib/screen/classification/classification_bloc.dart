import 'dart:async';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/screen/classification/classification_state.dart';

class ClassificationBloc {
  Repository _repository = Repository();

  String classficationId;
  Classification _classification;
  bool _isLoading = false;

  ClassificationBloc(this.classficationId) {
    _loadClassification();
  }

  void refresh() {
    _loadClassification();
  }

  Future delete() {
    return _repository.deleteClassification(classficationId);
  }

  // Classification state stream
  StreamController<ClassificationState> _classificationController =
      StreamController<ClassificationState>();

  Stream<ClassificationState> get state => _classificationController.stream;

  void _loadClassification() {
    if (_isLoading) return;
    _isLoading = true;
    _classificationController
        .add(ClassificationState.loading(classification: _classification));
    _repository.getClassificationLocal(classficationId).then((classification) {
      this._classification = classification;
      _setState(ClassificationState.loading(classification: _classification));
    });
    _repository.getClassification(classficationId).then((classification) {
      this._classification = classification;
      _setState(ClassificationState.success(_classification));
      _isLoading = false;
    }).catchError((err) {
      if (err is DioError) {
        _setState(ClassificationState.error(err.message.toString(),
            classification: _classification));
      } else {
        print(err);
        _setState(ClassificationState.error(err.toString(),
            classification: _classification));
      }
      _isLoading = false;
    });
  }

  _setState(ClassificationState state) {
    if (!_classificationController.isClosed)
      _classificationController.add(state);
  }

  void dispose() {
    _classificationController.close();
  }
}
