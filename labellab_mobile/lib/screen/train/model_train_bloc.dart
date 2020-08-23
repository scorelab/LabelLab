import 'dart:async';

import 'package:labellab_mobile/data/remote/dto/time_value.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/layer_dto.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/model_dto.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/step_dto.dart';
import 'package:labellab_mobile/screen/train/model_train_state.dart';

class ModelTrainBloc {
  final String projectId, modelId;
  bool _isLoading = false;
  List<Label> _labels;

  // State data
  List<Label> _currentClasses = [];
  List<StepDto> _currentSteps = [];
  List<LayerDto> _currentLayers = [];

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
          currentSteps: _currentSteps,
          currentLayers: _currentLayers));
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
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void removeClass(Label label) {
    _currentClasses.remove(label);
    _stateController.add(ModelTrainState.success(
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void addStep(StepDto step) {
    _currentSteps.add(step);
    _stateController.add(ModelTrainState.success(
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void removeStep(StepDto step) {
    _currentSteps.remove(step);
    _stateController.add(ModelTrainState.success(
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void addLayer(LayerDto layer) {
    _currentLayers.add(layer);
    _stateController.add(ModelTrainState.success(
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void removeLayer(LayerDto layer) {
    _currentLayers.remove(layer);
    _stateController.add(ModelTrainState.success(
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void trainModel(ModelDto modelDto) {
    modelDto.classes = _currentClasses;
    modelDto.steps = _currentSteps;
    modelDto.layers = _currentLayers;
  }

  // Project stream
  StreamController<ModelTrainState> _stateController =
      StreamController<ModelTrainState>();

  Stream<ModelTrainState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
