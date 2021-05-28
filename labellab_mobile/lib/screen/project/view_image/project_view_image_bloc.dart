import 'dart:async';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/screen/project/view_image/project_view_image_state.dart';

class ProjectViewImageBloc {
  Repository _repository = Repository();

  final String projectId;
  final String imageId;

  Image? _image;
  bool _isLoading = false;

  ProjectViewImageBloc(this.projectId, this.imageId) {
    fetchImage();
  }

  void fetchImage() {
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(ProjectViewImageState.loading(image: _image));
    _repository.getImage(imageId).then((image) {
      _image = image;
      _isLoading = false;
      _stateController.add(ProjectViewImageState.success(image: image));
    }).catchError((err) {
      _isLoading = false;
      print(err.toString());
      _stateController
          .add(ProjectViewImageState.error(err.toString(), image: _image));
    });
  }

  void delete() {
    _repository.deleteImage(projectId, imageId);
  }

  // Project stream
  StreamController<ProjectViewImageState> _stateController =
      StreamController<ProjectViewImageState>();

  Stream<ProjectViewImageState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
