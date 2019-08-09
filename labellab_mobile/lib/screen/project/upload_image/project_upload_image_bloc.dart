import 'dart:async';
import 'dart:io';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/api_response.dart';
import 'package:labellab_mobile/model/upload_image.dart';
import 'package:labellab_mobile/screen/project/upload_image/project_upload_image_state.dart';
import 'package:rxdart/rxdart.dart';

class ProjectUploadImageBloc {
  Repository _repository = Repository();

  String projectId;
  StreamSubscription<ApiResponse> _uploadProgress;
  List<UploadImage> _images = [];

  bool _isUploading = false;

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

  void uploadImages() {
    if (_isUploading) return;
    _isUploading = true;
    _stateController.add(ProjectUploadImageState.loading(images: _images));
    _uploadProgress = Observable.fromIterable(_images).flatMap((image) {
      image.state = UploadImageState.LOADING;
      _stateController.add(ProjectUploadImageState.loading(images: _images));
      return _repository.uploadImage(projectId, image).then((response) {
        image.state = UploadImageState.SUCCESS;
        _stateController.add(ProjectUploadImageState.loading(images: _images));
        return response;
      }).catchError((err) {
        print(err.toString());
      }).asStream();
    }).doOnDone(() {
      _isUploading = false;
      _stateController.add(ProjectUploadImageState.success(images: _images));
    }).doOnError((err) {
      print(err);
      _isUploading = false;
      _stateController
          .add(ProjectUploadImageState.error(err.toString(), images: _images));
    }).listen((response) {
      print(response.msg);
    });
  }

  // Project stream
  StreamController<ProjectUploadImageState> _stateController =
      StreamController<ProjectUploadImageState>();

  Stream<ProjectUploadImageState> get state => _stateController.stream;

  void dispose() {
    if (_uploadProgress != null) _uploadProgress.cancel();
    _stateController.close();
  }
}
