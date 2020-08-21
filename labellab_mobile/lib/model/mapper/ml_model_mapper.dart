import 'package:labellab_mobile/model/ml_model.dart';

class MlModelMapper {
  MlModelMapper._();

  static ModelType mapJsonToType(String type) {
    switch (type) {
      case "classifier":
        return ModelType.CLASSIFIER;

      default:
        return ModelType.CLASSIFIER;
    }
  }

  static ModelSource mapJsonToSource(String source) {
    switch (source) {
      case "transfer":
        return ModelSource.TRANSFER;
      case "upload":
        return ModelSource.UPLOAD;

      default:
        return ModelSource.CUSTOM;
    }
  }

  static String typeToString(ModelType type) {
    switch (type) {
      case ModelType.CLASSIFIER:
        return "Classifier";

      default:
        return "";
    }
  }

  static String sourceToString(ModelSource source) {
    switch (source) {
      case ModelSource.TRANSFER:
        return "Transfer";
      case ModelSource.UPLOAD:
        return "Upload";
      case ModelSource.CUSTOM:
        return "Custom";

      default:
        return "";
    }
  }
}
