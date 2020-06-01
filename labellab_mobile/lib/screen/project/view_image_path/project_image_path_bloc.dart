import 'dart:async';

import 'package:labellab_mobile/model/location.dart';
import 'package:labellab_mobile/screen/project/view_image_path/project_image_path_state.dart';

class ProjectImagePathBloc {
  final String projectId;
  final String imageId;

  List<Location> locations;
  bool _isLoading = false;

  ProjectImagePathBloc(this.projectId, this.imageId) {
    fetchPath();
  }

  void fetchPath() {
    // Feed path data to the state
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(ProjectImagePathState.loading());

    // Mock test data
    _stateController.add(ProjectImagePathState.success(locations: [
      Location(latitude: 6.927079, longitude: 79.861244),
      Location(latitude: 6.928120, longitude: 79.881250),
    ]));

    //TODO: Write fetch call
  }

  StreamController<ProjectImagePathState> _stateController =
      StreamController<ProjectImagePathState>();

  Stream<ProjectImagePathState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
