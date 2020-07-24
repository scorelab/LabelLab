import 'package:charts_flutter/flutter.dart' as charts;
import 'package:labellab_mobile/data/remote/dto/time_value.dart';

class ModelTrainState {
  bool isInitial = false;
  bool isLoading = false;
  bool isTraining = false;
  bool isTrainingSuccess = false;
  String error;
  List<charts.Series<TimeValue, DateTime>> results;

  ModelTrainState.initial() {
    isInitial = true;
  }

  ModelTrainState.loading() {
    isLoading = true;
  }

  ModelTrainState.error({this.error});

  ModelTrainState.success();

  ModelTrainState.training() {
    isTraining = true;
  }

  ModelTrainState.trainSuccess({this.results}) {
    isTrainingSuccess = true;
  }
}
