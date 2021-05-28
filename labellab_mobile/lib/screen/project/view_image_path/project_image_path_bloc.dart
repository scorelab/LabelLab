import 'dart:async';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/location.dart';
import 'package:labellab_mobile/screen/project/view_image_path/project_image_path_state.dart';
import 'package:logger/logger.dart';

class ProjectImagePathBloc {
  Repository _repository = Repository();

  final String projectId;
  final String imageId;

  late List<Image> _images;
  List<Label>? _labels;
  List<Location>? _locations;
  bool _isLoading = false;

  ProjectImagePathBloc(this.projectId, this.imageId) {
    fetchImages();
  }

  void fetchImages() {
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(ProjectImagePathState.loading());
    _repository.getImages(projectId).then((images) {
      _images = images;
      _labels = images
          .firstWhere((image) => image.id == imageId)
          .labels!
          .map((selection) => selection!.label)
          .toList();
      _isLoading = false;
      _stateController.add(ProjectImagePathState.success(
          labels: _labels, locations: _locations));
    }).catchError((err) {
      _isLoading = false;
      Logger().e(err);
      _stateController.add(
          ProjectImagePathState.error(err.toString(), locations: _locations));
    });
  }

  void selectLabel(String? labelId) {
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(ProjectImagePathState.loading());
    List<String?> ids = _images
        .where((image) =>
            image.labels!.map((label) => label!.label.id).contains(labelId))
        .map((image) => image.id) as List<String?>;
    _repository.getImagesPath(projectId, ids).then((locations) {
      _locations = locations;
      _stateController.add(ProjectImagePathState.success(
          labels: _labels, locations: _locations));
    }).catchError((err) {
      _isLoading = false;
      _stateController.add(ProjectImagePathState.error(err));
    });
  }

  StreamController<ProjectImagePathState> _stateController =
      StreamController<ProjectImagePathState>();

  Stream<ProjectImagePathState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
