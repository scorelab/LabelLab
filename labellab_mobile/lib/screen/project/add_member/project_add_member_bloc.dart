import 'dart:async';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_state.dart';
import 'package:rxdart/rxdart.dart';

class ProjectAddMemberBloc {
  Repository _repository = Repository();

  String projectId;

  List<User> _users;
  bool _isLoading = false;

  final _searchSubject = PublishSubject<String>();

  ProjectAddMemberBloc(this.projectId) {
    _searchSubject
        .distinct()
        .debounceTime(Duration(milliseconds: 300))
        .listen((query) {
      _setState(ProjectAddMemberState.loading(users: _users));
      _repository.searchUser(query).then((users) {
        _users = users;
        _setState(ProjectAddMemberState.successFetch(users));
      }).catchError((err) {
        _setState(ProjectAddMemberState.error(err.toString(), users: _users));
      });
    });
  }

  void searchUser(String email) {
    _searchSubject.add(email);
  }

  void addMember(String email, String role) {
    if (_isLoading) return;
    _isLoading = true;
    _repository.addMember(projectId, email, role).then((res) {
      _isLoading = false;
      _setState(ProjectAddMemberState.successSet(_users));
    }).catchError((err) {
      _isLoading = false;
      _setState(ProjectAddMemberState.error(err.message.toString()));
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
    _searchSubject.close();
    _stateController.close();
  }
}
