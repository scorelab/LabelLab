import 'dart:async';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_state.dart';

class ProjectDetailBloc {
  Repository _repository = Repository();

  String projectId;

  Project? _project;
  bool _isLoading = false;
  List<String?> _selectedImages = [];
  List<String> _roles = [];

  ProjectDetailBloc(this.projectId) {
    _loadProject();
  }

  void refresh() {
    _loadProject();
  }

  void delete() {
    _repository.deleteProject(projectId);
  }

  void removeUser(String? email) {
    _repository.removeMember(projectId, email).then((_) {
      refresh();
    });
  }

  void deleteLabel(String? id) {
    _repository.deleteLabel(projectId, id).then((_) {
      refresh();
    });
  }

  // Used for initial selection of image
  void selectImage(String? id) {
    _selectedImages.add(id);
    _setState(ProjectDetailState.multiSelect(_project,
        selectedImages: _selectedImages));
  }

  // Used to switch selection state
  void switchSelection(String? id) {
    _selectedImages.contains(id)
        ? _selectedImages.remove(id)
        : _selectedImages.add(id);
    _setState(ProjectDetailState.multiSelect(_project,
        selectedImages: _selectedImages));
  }

  // Used to select all images
  void selectAllImages() {
    _selectedImages = _project!.images!.map((image) => image.id).toList();
    _setState(ProjectDetailState.multiSelect(_project,
        selectedImages: _selectedImages));
  }

  // Used to delete selected images
  void deleteSelected() {
    _repository.deleteImages(projectId, _selectedImages).then((_) {
      refresh();
    });
  }

  // Used to cancel current selection
  void cancelSelection() {
    _selectedImages = [];
    _setState(ProjectDetailState.success(_project));
  }

  // Project stream
  StreamController<ProjectDetailState> _stateController =
      StreamController<ProjectDetailState>();

  Stream<ProjectDetailState> get state => _stateController.stream;

  void _loadProject() {
    _selectedImages = [];
    if (_isLoading) return;
    _isLoading = true;
    _setState(ProjectDetailState.loading(project: _project));
    _repository.getProject(projectId).then((project) {
      this._project = project;
      _repository.getModels(projectId).then((models) {
        this._project!.models = models;
        _repository.getMemberRoles(projectId).then((roles) {
          this._roles = roles;
          _setState(ProjectDetailState.success(_project));
          _isLoading = false;
        });
      });
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

  bool hasAdminAccess() {
    return this._roles.contains('admin');
  }

  bool hasImagesAccess() {
    return this._roles.contains('admin') || this._roles.contains('images');
  }

  bool hasModelsAccess() {
    return this._roles.contains('admin') || this._roles.contains('models');
  }

  bool hasLabelsAccess() {
    return this._roles.contains('admin') || this._roles.contains('labels');
  }

  bool hasImageLabellingAccess() {
    return this._roles.contains('admin') ||
        this._roles.contains('image labelling');
  }
}
