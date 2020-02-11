import 'dart:async';
import 'dart:io';

import 'package:labellab_mobile/screen/project/edit_image/project_edit_image_state.dart';
import 'package:logger/logger.dart';

class ProjectEditImageBloc {
  File _image;
  bool _isLoading = false;

  ProjectEditImageBloc(String imagePath) {
    loadImage(imagePath);
  }

  void loadImage(String imagePath) {
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(ProjectEditImageState.loading(image: _image));
    imagePath = imagePath.replaceAll(new RegExp('#'), '/');
    Logger().i(imagePath);
    _image = File(imagePath);
    _isLoading = false;
    _stateController.add(ProjectEditImageState.success(image: _image));
  }

  void cropImage(File croppedFile) {
    _image = croppedFile;
    _stateController.add(ProjectEditImageState.success(image: _image));
  }

  StreamController<ProjectEditImageState> _stateController =
      StreamController<ProjectEditImageState>();

  Stream<ProjectEditImageState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
