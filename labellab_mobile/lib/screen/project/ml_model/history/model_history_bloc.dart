import 'dart:async';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/screen/project/ml_model/history/model_history_state.dart';

class ModelHistoryBloc {
  Repository _repository = Repository();

  final String projectId;
  final String modelId;

  List<MlModel> _trainedModels;
  bool _isLoading = false;

  ModelHistoryBloc(this.projectId, this.modelId) {
    fetchModels();
  }

  void fetchModels() {
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(ModelHistoryState.loading());
    _repository.getTrainedModels(projectId).then((models) {
      if (models.isNotEmpty)
        _trainedModels = models.where((model) => model.id == modelId);
      _isLoading = false;
      _stateController.add(ModelHistoryState.success(models: _trainedModels));
    }).catchError((error) {
      _isLoading = false;
      _stateController.add(ModelHistoryState.error(error));
    });
  }

  StreamController<ModelHistoryState> _stateController =
      StreamController<ModelHistoryState>();

  Stream<ModelHistoryState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
