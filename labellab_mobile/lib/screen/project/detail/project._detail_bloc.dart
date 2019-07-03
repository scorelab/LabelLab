import 'dart:async';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_state.dart';

class ProjectDetailBloc {
  Repository _repository = Repository();

  String projectId;

  Project _project;
  bool _isLoading = false;

  ProjectDetailBloc(this.projectId) {
    _loadProject();
  }

  void refresh() {
    _loadProject();
  }

  void delete() {
    _repository.deleteProject(projectId).then((_) {
      _loadProject();
    });
  }

  // Project stream
  StreamController<ProjectDetailState> _stateController =
      StreamController<ProjectDetailState>();

  Stream<ProjectDetailState> get state => _stateController.stream;

  void _loadProject() {
    if (_isLoading) return;
    _isLoading = true;
    _setState(ProjectDetailState.loading(project: _project));
    _repository.getProject(projectId).then((project) {
      this._project = project;
      _setState(ProjectDetailState.success(_project));
      _isLoading = false;
    }).catchError((err) {
      if (err is DioError) {
        _setState(ProjectDetailState.error(err.message.toString(),
            project: _project));
      } else {
        _setState(ProjectDetailState.error(err.toString(), project: _project));
      }
      _isLoading = false;
    });
  }

  _setState(ProjectDetailState state) {
    if (!_stateController.isClosed) _stateController.add(state);
  }

  void dispose() {
    _stateController.close();
  }
}
