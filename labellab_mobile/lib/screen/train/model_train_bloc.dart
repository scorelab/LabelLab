import 'dart:async';

import 'package:labellab_mobile/screen/train/model_train_state.dart';

class ModelTrainBloc {
  final String groupId;

  ModelTrainBloc(this.groupId);

  // Project stream
  StreamController<ModelTrainState> _stateController =
      StreamController<ModelTrainState>();

  Stream<ModelTrainState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
