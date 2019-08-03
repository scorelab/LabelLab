import 'dart:async';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_state.dart';

class ProjectAddMemberBloc {
  Repository _repository = Repository();

  String projectId;

  User _user;
  bool _isLoading = false;

  ProjectAddMemberBloc(this.projectId);

  void searchUser(String email) {
    if (_isLoading) return;
    _isLoading = true;
    _setState(ProjectAddMemberState.loading(user: _user));
    _repository.searchUser(email).then((user) {
      _isLoading = false;
      _setState(ProjectAddMemberState.successFetch(user));
    }).catchError((err) {
      _isLoading = false;
      _setState(ProjectAddMemberState.error(err.toString()));
    });
  }

  void addMember(String email) {
    if (_isLoading) return;
    _isLoading = true;
    _repository.addMember(projectId, email).then((res) {
      _isLoading = false;
      _setState(ProjectAddMemberState.successSet(_user));
    }).catchError((err) {
      _isLoading = false;
      _setState(ProjectAddMemberState.error(err.toString()));
    });
  }

  // State stream
  StreamController<ProjectAddMemberState> _stateController =
      StreamController<ProjectAddMemberState>();

  Stream<ProjectAddMemberState> get state => _stateController.stream;

  _setState(ProjectAddMemberState state) {
    if (!_stateController.isClosed) _stateController.add(state);
  }

  void dispose() {
    _stateController.close();
  }
}
