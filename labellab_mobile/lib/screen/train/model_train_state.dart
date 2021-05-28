import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/layer_dto.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/step_dto.dart';

class ModelTrainState {
  bool isLoading = false;
  bool isTraining = false;
  String? error;
  MlModel? model;
  List<Label>? labels;

  List<Label>? currentClasses;
  List<StepDto>? currentSteps;
  List<LayerDto>? currentLayers;

  ModelTrainState.initial();

  ModelTrainState.loading() {
    isLoading = true;
  }

  ModelTrainState.error({this.error});

  ModelTrainState.success({
    this.model,
    this.labels,
    this.currentClasses,
    this.currentSteps,
    this.currentLayers,
  });

  ModelTrainState.training() {
    isTraining = true;
  }
}
