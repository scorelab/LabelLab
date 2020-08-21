import 'package:labellab_mobile/model/label.dart';

enum ModelType { CLASSIFIER }

enum ModelSource { TRANSFER, UPLOAD, CUSTOM }

class MlModel {
  String id;
  String name,
      preprocessingUrl,
      layersUrl,
      loss,
      optimizer,
      metric,
      lossGraphUrl,
      accuracyGraphUrl,
      saveModelUrl,
      transferSource,
      projectId;
  ModelType type;
  ModelSource source;
  double train, test, validation, epochs, batchSize, learningRate;
  List<Label> labels;

  MlModel.fromJson(dynamic json) {
    id = json['id'];
    name = json['name'];
    preprocessingUrl = json['preprocessing_steps_json_url'];
    layersUrl = json['layers_json_url'];
    loss = json['loss'];
    optimizer = json['optimizer'];
    metric = json['metric'];
    lossGraphUrl = json['loss_graph_url'];
    accuracyGraphUrl = json['accuracy_graph_url'];
    saveModelUrl = json['saved_model_url'];
    transferSource = json['transfer_source'];
    projectId = json['project_id'];
    type = ModelType.CLASSIFIER;
    source = mapJsonToSource(json['source']);
    train = json['train'];
    test = json['test'];
    validation = json['validation'];
    epochs = json['epochs'];
    batchSize = json['batch_size'];
    learningRate = json['learning_rate'];
    labels = json['labels'];
  }

  ModelSource mapJsonToSource(String source) {
    switch (source) {
      case "transfer":
        return ModelSource.TRANSFER;
      case "upload":
        return ModelSource.UPLOAD;

      default:
        return ModelSource.CUSTOM;
    }
  }
}
