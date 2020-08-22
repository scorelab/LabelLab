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

  static String learnToString(ModelToLearn toLearn) {
    switch (toLearn) {
      case ModelToLearn.DN121:
        return "DenseNet121";
      case ModelToLearn.DN169:
        return "DenseNet169";
      case ModelToLearn.DN201:
        return "DenseNet201";
      case ModelToLearn.INCEPTIONRNV2:
        return "InceptionResNetV2";
      case ModelToLearn.INCEPTIONV3:
        return "InceptionV3";
      case ModelToLearn.MN:
        return "MobileNet";
      case ModelToLearn.MNV2:
        return "MobileNetV2";
      case ModelToLearn.NASNETLARGE:
        return "NASNetLarge";
      case ModelToLearn.NASNETMOBILE:
        return "NASNetMobile";
      case ModelToLearn.RN50:
        return "ResNet50";
      case ModelToLearn.RN101:
        return "ResNet101";
      case ModelToLearn.RN152:
        return "ResNet152";
      case ModelToLearn.RN101V2:
        return "ResNet101V2";
      case ModelToLearn.RN152V2:
        return "ResNet152V2";
      case ModelToLearn.RN50V2:
        return "ResNet50V2";
      case ModelToLearn.VGG16:
        return "VGG16";
      case ModelToLearn.VGG19:
        return "VGG19";
      case ModelToLearn.XCEPTION:
        return "Xception";

      default:
        return "";
    }
  }

  static String lossToString(ModelLoss loss) {
    switch (loss) {
      case ModelLoss.BCE:
        return "Binary Cross Entropy";

      case ModelLoss.CCE:
        return "Categorical Cross Entropy";

      default:
        return "";
    }
  }

  static String optimizerToString(ModelOptimizer optimizer) {
    switch (optimizer) {
      case ModelOptimizer.ADADELTA:
        return "Adedelta";
      case ModelOptimizer.ADAGRAD:
        return "Adagrad";
      case ModelOptimizer.ADAM:
        return "Adam";
      case ModelOptimizer.ADAMAX:
        return "Adamax";
      case ModelOptimizer.FTRL:
        return "Ftrl";
      case ModelOptimizer.NADAM:
        return "Nadam";
      case ModelOptimizer.RMSPROP:
        return "RMSProp";
      case ModelOptimizer.SGD:
        return "SGD";

      default:
        return "";
    }
  }

  static String metricToString(ModelMetric metric) {
    switch (metric) {
      case ModelMetric.ACCURACY:
        return "Accuracy";

      default:
        return "";
    }
  }
}
