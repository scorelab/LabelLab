import 'dart:async';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/screen/project/project_state.dart';

class ProjectBloc {
  Repository _repository = Repository();

  List<Project> _projects;
  bool _isLoading = false;

  ProjectBloc() {
    _loadProjects();
  }

  void refresh() {
    _loadProjects();
  }

  // Project stream
  StreamController<ProjectState> _projectController =
      StreamController<ProjectState>();

  Stream<ProjectState> get projects => _projectController.stream;

  void _loadProjects() {
    if (_isLoading) return;
    _isLoading = true;
    _projectController.add(ProjectState.loading(projects: _projects));
    _repository.getProjectsLocal().then((projects) {
      this._projects = projects;
      _projectController.add(ProjectState.loading(projects: _projects));
    });
    _repository.getProjects().then((projects) {
      this._projects = projects;
      _projectController.add(ProjectState.success(_projects));
      _isLoading = false;
    }).catchError((err) {
      if (err is DioError) {
        _projectController.add(
            ProjectState.error(err.message.toString(), projects: _projects));
      } else {
        _projectController
            .add(ProjectState.error(err.toString(), projects: _projects));
      }
      _isLoading = false;
    });
  }

  void dispose() {
    _projectController.close();
  }
}
