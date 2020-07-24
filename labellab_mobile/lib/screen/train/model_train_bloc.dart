import 'dart:async';

import 'package:labellab_mobile/data/remote/dto/time_value.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:labellab_mobile/screen/train/model_train_state.dart';

class ModelTrainBloc {
  final String groupId;
  bool _isLoading = false;
  List<charts.Series<TimeValue, DateTime>> _results;

  Repository _repository = Repository();

  ModelTrainBloc(this.groupId);

  initTrain() {
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(ModelTrainState.loading());
    _repository.getResults().then((value) {
      _isLoading = false;
      _results = value;
      _stateController.add(ModelTrainState.trainSuccess(results: _results));
    }).catchError((error) {
      _isLoading = false;
      _stateController.add(ModelTrainState.error());
    });
  }

  // Project stream
  StreamController<ModelTrainState> _stateController =
      StreamController<ModelTrainState>();

  Stream<ModelTrainState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
