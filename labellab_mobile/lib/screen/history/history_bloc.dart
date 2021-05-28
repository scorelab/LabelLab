import 'dart:async';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/screen/history/history_state.dart';

class HistoryBloc {
  Repository _repository = Repository();

  List<Classification>? _classifications;
  bool _isLoading = false;

  HistoryBloc() {
    _loadClassifications();
  }

  void refresh() {
    _loadClassifications();
  }

  Future delete(String? id) {
    _setState(HistoryState.loading(classifications: _classifications));
    return _repository.deleteClassification(id).then((success) {
      if (success) _loadClassifications();
    });
  }

  // Classification stream
  StreamController<HistoryState> _classificationController =
      StreamController<HistoryState>();

  Stream<HistoryState> get classifications => _classificationController.stream;

  void _loadClassifications() {
    if (_isLoading) return;
    _isLoading = true;
    _classificationController
        .add(HistoryState.loading(classifications: _classifications));
    _repository.getClassificationsLocal().then((classifications) {
      this._classifications = classifications;
      _setState(HistoryState.loading(classifications: _classifications));
    });
    _repository.getClassifications().then((classifications) {
      this._classifications = classifications;
      _setState(HistoryState.success(_classifications));
      _isLoading = false;
    }).catchError((err) {
      if (err is DioError) {
        _setState(HistoryState.error(err.message.toString(),
            classifications: _classifications));
      } else {
        _setState(HistoryState.error(err.toString(),
            classifications: _classifications));
      }
      _isLoading = false;
    });
  }

  _setState(HistoryState state) {
    if (!_classificationController.isClosed)
      _classificationController.add(state);
  }

  void dispose() {
    _classificationController.close();
  }
}
