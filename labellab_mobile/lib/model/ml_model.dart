import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/mapper/ml_model_mapper.dart';

enum ModelType { CLASSIFIER }

enum ModelSource { TRANSFER, UPLOAD, CUSTOM }

enum ModelToLearn {
  DN121,
  DN169,
  DN201,
  INCEPTIONRNV2,
  INCEPTIONV3,
  MN,
  MNV2,
  NASNETLARGE,
  NASNETMOBILE,
  RN50,
  RN101,
  RN152,
  RN101V2,
  RN152V2,
  RN50V2,
  VGG16,
  VGG19,
  XCEPTION
}

enum ModelLoss { BCE, CCE }

enum ModelOptimizer {
  ADADELTA,
  ADAGRAD,
  ADAM,
  ADAMAX,
  FTRL,
  NADAM,
  RMSPROP,
  SGD
}

enum ModelMetric { ACCURACY }

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

  MlModel.fromData({this.id, this.name, this.type, this.source});

  MlModel.fromJson(dynamic json) {
    id = json['id'].toString();
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
    type = MlModelMapper.mapJsonToType(json["type"]);
    source = MlModelMapper.mapJsonToSource(json['source']);
    train = json['train'];
    test = json['test'];
    validation = json['validation'];
    epochs = json['epochs'];
    batchSize = json['batch_size'];
    learningRate = json['learning_rate'];
    labels = json['labels'];
  }

  Map<String, dynamic> toMap() {
    return {
      "name": name,
      "type": MlModelMapper.typeToString(type),
      "source": MlModelMapper.sourceToString(source),
      "projectId": projectId
    };
  }
}
