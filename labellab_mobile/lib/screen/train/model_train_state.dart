import 'package:charts_flutter/flutter.dart' as charts;
import 'package:labellab_mobile/data/remote/dto/time_value.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/ml_model.dart';

class ModelTrainState {
  bool isLoading = false;
  String error;
  List<Label> labels;
  List<Label> currentClasses;

  ModelTrainState.initial();

  ModelTrainState.loading() {
    isLoading = true;
  }

  ModelTrainState.error({this.error});

  ModelTrainState.success({this.labels, this.currentClasses});
}
