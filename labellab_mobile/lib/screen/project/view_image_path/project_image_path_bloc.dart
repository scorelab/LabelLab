import 'dart:async';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/location.dart';
import 'package:labellab_mobile/screen/project/view_image_path/project_image_path_state.dart';
import 'package:logger/logger.dart';

class ProjectImagePathBloc {
  Repository _repository = Repository();

  final String projectId;
  final String imageId;

  List<Location> _locations;
  bool _isLoading = false;

  ProjectImagePathBloc(this.projectId, this.imageId) {
    fetchPath();
  }

  void fetchPath() {
    // Feed path data to the state
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(ProjectImagePathState.loading());
    _repository.getImagePath(imageId).then((locations) {
      _locations = locations;
      _isLoading = false;
      _stateController
          .add(ProjectImagePathState.success(locations: _locations));
    }).catchError((err) {
      _isLoading = false;
      Logger().e(err);
      _stateController.add(
          ProjectImagePathState.error(err.toString(), locations: _locations));
    });

    // Mock test data
    // _stateController.add(ProjectImagePathState.success(locations: [
    //   Location(latitude: 6.927079, longitude: 79.861244),
    //   Location(latitude: 6.928120, longitude: 79.881250),
    // ]));
  }

  StreamController<ProjectImagePathState> _stateController =
      StreamController<ProjectImagePathState>();

  Stream<ProjectImagePathState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
