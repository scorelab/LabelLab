import 'dart:async';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/group.dart';
import 'package:labellab_mobile/screen/project/view_group/project_view_group_state.dart';

class ProjectViewGroupBloc {
  Repository _repository = Repository();

  final String projectId;
  final String groupId;

  Group _group;
  bool _isLoading = false;

  ProjectViewGroupBloc(this.projectId, this.groupId) {
    fetchGroup();
  }

  void fetchGroup() {
    if (_isLoading) return;
    _isLoading = true;
    _stateController.add(ProjectViewGroupState.loading(group: _group));
    _repository.getGroup(groupId).then((group) {
      _group = group;
      _isLoading = false;
      _stateController.add(ProjectViewGroupState.success(group: _group));
    }).catchError((error) {
      _isLoading = false;
      _stateController.add(ProjectViewGroupState.error(error, group: _group));
    });
  }

  StreamController<ProjectViewGroupState> _stateController =
      StreamController<ProjectViewGroupState>();

  Stream<ProjectViewGroupState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }
}
