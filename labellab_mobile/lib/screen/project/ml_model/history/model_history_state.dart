import 'package:labellab_mobile/model/ml_model.dart';

class ModelHistoryState {
  bool isLoading = false;
  String error;

  List<MlModel> models;

  ModelHistoryState.loading();

  ModelHistoryState.error(this.error);

  ModelHistoryState.success({this.models});
}
