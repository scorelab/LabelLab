import 'dart:async';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/log.dart';
import 'package:labellab_mobile/screen/project/project_activity/project_activity_state.dart';

class ProjectActivityBloc {
  Repository _repository = Repository();

  String _projectId;
  bool _isLoading = false;
  List<Log> _logs = [];

  ProjectActivityBloc(this._projectId) {
    _fetchLogs();
  }

  // Project Activity Stream
  StreamController<ProjectActivityState> _stateController =
      StreamController<ProjectActivityState>();

  void _fetchLogs() {
    _repository.getProjectActivityLogs(this._projectId).then((logs) {
      this._logs = [...logs];
      this._setState(ProjectActivityState.success(this._logs));
      this._isLoading = false;
    }).catchError((err) {
      print(err);
      this._setState(ProjectActivityState.error(err));
    });
  }

  _setState(ProjectActivityState state) {
    if (!_stateController.isClosed) _stateController.add(state);
  }

  void refresh() {
    _fetchLogs();
  }

  void dispose() {
    _stateController.close();
  }

  Stream<ProjectActivityState> get state => _stateController.stream;

  bool get isLoading => this._isLoading;

  String get projectId => this._projectId;
}
