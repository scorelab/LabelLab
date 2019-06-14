import 'dart:async';

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

  Future<String> update(Project project) {
    if (project.id == null) {
      // Create new project
      return _repository.createProject(project).then((res) {
        if (!res.success) return res.msg;
        _loadProjects();
        return "Success";
      });
    } else {
      // Update the existing project
      return _repository.updateProject(project).then((res) {
        if (!res.success) return res.msg;
        _loadProjects();
        return "Success";
      });
    }
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
    });
  }

  void dispose() {
    _projectController.close();
  }
}
