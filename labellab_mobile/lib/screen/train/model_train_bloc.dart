import 'dart:async';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/layer_dto.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/model_dto.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/step_dto.dart';
import 'package:labellab_mobile/screen/train/model_train_state.dart';

class ModelTrainBloc {
  final String projectId, modelId;
  bool _isLoading = false;

  MlModel? _model;
  List<Label>? _labels;

  // State data
  List<Label> _currentClasses = [];
  List<StepDto> _currentSteps = [];
  List<LayerDto> _currentLayers = [];

  Repository _repository = Repository();

  ModelTrainBloc(this.projectId, this.modelId) {
    fetchData();
  }

  void fetchData() async {
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(ModelTrainState.loading());
    try {
      _model = await _repository.getModel(modelId);
      _labels = await _repository.getLabels(projectId);
      _isLoading = false;
      _stateController.add(ModelTrainState.success(
          model: _model,
          labels: _labels,
          currentClasses: _currentClasses,
          currentSteps: _currentSteps,
          currentLayers: _currentLayers));
    } catch (e) {
      _isLoading = false;
      _stateController.add(ModelTrainState.error(error: e.toString()));
    }
  }

  void addClass(String labelId) {
    Label _toAdd = _labels!.where((label) => label.id == labelId).first;
    if (!_currentClasses.contains(_toAdd)) _currentClasses.add(_toAdd);
    _stateController.add(ModelTrainState.success(
        model: _model,
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void removeClass(Label label) {
    _currentClasses.remove(label);
    _stateController.add(ModelTrainState.success(
        model: _model,
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void addStep(StepDto step) {
    _currentSteps.add(step);
    _stateController.add(ModelTrainState.success(
        model: _model,
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void removeStep(StepDto step) {
    _currentSteps.remove(step);
    _stateController.add(ModelTrainState.success(
        model: _model,
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void addLayer(LayerDto layer) {
    _currentLayers.add(layer);
    _stateController.add(ModelTrainState.success(
        model: _model,
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void removeLayer(LayerDto layer) {
    _currentLayers.remove(layer);
    _stateController.add(ModelTrainState.success(
        model: _model,
        labels: _labels,
        currentClasses: _currentClasses,
        currentSteps: _currentSteps,
        currentLayers: _currentLayers));
  }

  void saveModel(ModelDto modelDto) {
    modelDto.classes = _currentClasses;
    modelDto.steps = _currentSteps;
    modelDto.layers = _currentLayers;
    _repository.saveModel(modelId, _model, modelDto).then((response) {
      _stateController.add(ModelTrainState.success(
          model: _model,
          labels: _labels,
          currentClasses: _currentClasses,
          currentSteps: _currentSteps,
          currentLayers: _currentLayers));
    });
    refresh();
  }

  void refresh() {
    fetchData();
  }

  void trainModel() {
    _repository.trainModel(modelId).then((response) {
      if (response.success!) {
        _stateController.add(ModelTrainState.training());
      } else {
        _stateController.add(ModelTrainState.error(error: "Training aborted"));
      }
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
