import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/layer_dto.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/step_dto.dart';

class ModelDto {
  final String? train, validation, test, epochs, batchSize, learningRate;
  final ModelToLearn? modelToLearn;
  final ModelLoss? loss;
  final ModelOptimizer? optimizer;
  final ModelMetric? metric;
  List<Label>? classes;
  late List<StepDto> steps;
  late List<LayerDto> layers;

  ModelDto(
      {this.train,
      this.validation,
      this.test,
      this.epochs,
      this.batchSize,
      this.learningRate,
      this.modelToLearn,
      this.loss,
      this.optimizer,
      this.metric});
}
