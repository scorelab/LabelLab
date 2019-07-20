import 'dart:async';
import 'dart:io';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/upload_image.dart';
import 'package:labellab_mobile/screen/project/upload_image/project_upload_image_state.dart';

class ProjectUploadImageBloc {
  Repository _repository = Repository();

  String projectId;
  List<UploadImage> _images = [];

  ProjectUploadImageBloc(this.projectId);

  void selectImage(File image) {
    final _image = UploadImage(image: image);
    _images.add(_image);
    _stateController.add(ProjectUploadImageState.imageChange(images: _images));
  }

  void unselectImage(UploadImage image) {
    _images.remove(image);
    _stateController.add(ProjectUploadImageState.imageChange(images: _images));
  }

  bool uploadImages() {
    return false;
  }

  // Project stream
  StreamController<ProjectUploadImageState> _stateController =
      StreamController<ProjectUploadImageState>();

  Stream<ProjectUploadImageState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
