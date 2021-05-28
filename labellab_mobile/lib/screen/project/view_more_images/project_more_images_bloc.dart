import 'dart:async';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/screen/project/view_more_images/project_more_images_state.dart';

class ProjectMoreImagesBloc {
  Repository _repository = Repository();

  String projectId;

  List<Image>? _images;
  bool _isLoading = false;

  ProjectMoreImagesBloc(this.projectId) {
    _loadImages();
  }

  void refresh() {
    _loadImages();
  }

  // State stream
  StreamController<ProjectMoreImagesState> _stateController =
      StreamController<ProjectMoreImagesState>();

  Stream<ProjectMoreImagesState> get state => _stateController.stream;

  void _loadImages() {
    if (_isLoading) return;
    _isLoading = true;
    _setState(ProjectMoreImagesState.loading(images: _images));
    _repository.getProject(projectId).then((project) {
      this._images = project.images;
      _setState(ProjectMoreImagesState.success(_images));
      _isLoading = false;
    }).catchError((err) {
      if (err is DioError) {
        _setState(
          ProjectMoreImagesState.error(err.message.toString(), images: _images),
        );
      } else {
        _setState(
          ProjectMoreImagesState.error(err.toString(), images: _images),
        );
      }
      _isLoading = false;
    });
  }

  _setState(ProjectMoreImagesState state) {
    if (!_stateController.isClosed) _stateController.add(state);
  }

  void dispose() {
    _stateController.close();
  }
}
