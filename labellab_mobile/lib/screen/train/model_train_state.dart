import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/step_dto.dart';

class ModelTrainState {
  bool isLoading = false;
  String error;
  List<Label> labels;

  List<Label> currentClasses;
  List<StepDto> currentSteps;

  ModelTrainState.initial();

  ModelTrainState.loading() {
    isLoading = true;
  }

  ModelTrainState.error({this.error});

  ModelTrainState.success(
      {this.labels, this.currentClasses, this.currentSteps});
}
