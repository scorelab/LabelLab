import 'dart:async';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/group.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/screen/project/view_group/add_images/group_add_images_state.dart';

class GroupAddImagesBloc {
  Repository _repository = Repository();

  final String projectId;
  final String groupId;

  List<Image> _unselectedImages;
  List<String> _selectedImages = [];

  bool _isLoading = false;

  GroupAddImagesBloc(this.projectId, this.groupId) {
    _loadData();
  }

  void _loadData() {
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(GroupAddImagesState.loading(
        images: _unselectedImages, selectedImages: _selectedImages));
    Future.wait(
            [_repository.getProject(projectId), _repository.getGroup(groupId)])
        .then((result) {
      Project _currentProject = result.first;
      Group _currentGroup = result.last;
      _isLoading = false;
      _currentGroup.images
          .forEach((image) => _currentProject.images.remove(image));
      _unselectedImages = _currentProject.images;
      _stateController.add(GroupAddImagesState.success(
          images: _unselectedImages, selectedImages: _selectedImages));
    }).catchError((error) {
      _isLoading = false;
      _stateController.add(GroupAddImagesState.error(error,
          images: _unselectedImages, selectedImages: _selectedImages));
    });
  }

  void switchSelection(String id) {
    _selectedImages.contains(id)
        ? _selectedImages.remove(id)
        : _selectedImages.add(id);
    _stateController.add(GroupAddImagesState.success(
        images: _unselectedImages, selectedImages: _selectedImages));
  }

  void addImages() {
    if (_isLoading) return;
    _stateController
        .add(GroupAddImagesState.loading(images: _unselectedImages));
    _repository.addGroupImages(projectId, groupId, _selectedImages);
  }

  StreamController<GroupAddImagesState> _stateController =
      StreamController<GroupAddImagesState>();

  Stream<GroupAddImagesState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
