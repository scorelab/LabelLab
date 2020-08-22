import 'dart:async';

import 'package:labellab_mobile/data/remote/dto/time_value.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/step_dto.dart';
import 'package:labellab_mobile/screen/train/model_train_state.dart';

class ModelTrainBloc {
  final String projectId, modelId;
  bool _isLoading = false;
  List<Label> _labels;

  // State data
  List<Label> _currentClasses = [];
  List<StepDto> _currentSteps = [];

  Repository _repository = Repository();

  ModelTrainBloc(this.projectId, this.modelId) {
    fetchLabels();
  }

  void fetchLabels() {
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(ModelTrainState.loading());
    _repository.getLabels(projectId).then((labels) {
      _labels = labels;
      _isLoading = false;
      _stateController.add(ModelTrainState.success(
          labels: _labels,
          currentClasses: _currentClasses,
          currentSteps: _currentSteps));
    }).catchError((err) {
      _isLoading = false;
      _stateController.add(ModelTrainState.error(error: err));
    });
  }

  void addClass(String labelId) {
    Label _toAdd = _labels.where((label) => label.id == labelId).first;
    if (!_currentClasses.contains(_toAdd)) _currentClasses.add(_toAdd);
    _stateController.add(ModelTrainState.success(
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps));
  }

  void removeClass(Label label) {
    _currentClasses.remove(label);
    _stateController.add(ModelTrainState.success(
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps));
  }

  void addStep(StepDto step) {
    _currentSteps.add(step);
    _stateController.add(ModelTrainState.success(
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps));
  }

  void removeStep(StepDto step) {
    _currentSteps.remove(step);
    _stateController.add(ModelTrainState.success(
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps));
  }

  // Project stream
  StreamController<ModelTrainState> _stateController =
      StreamController<ModelTrainState>();

  Stream<ModelTrainState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
