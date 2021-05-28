import 'package:labellab_mobile/model/user.dart';

class ProjectAddMemberState {
  bool isLoading = false;
  bool fetchSuccess = false;
  bool setSuccess = false;
  String? error;
  List<User>? users;

  ProjectAddMemberState.initial();
  
  ProjectAddMemberState.loading({this.users}) {
    isLoading = true;
  }

  ProjectAddMemberState.error(this.error, {this.users});

  ProjectAddMemberState.successFetch(this.users) {
    this.fetchSuccess = true;
  }

  ProjectAddMemberState.successSet(this.users) {
    this.fetchSuccess = true;
    this.setSuccess = true;
  }
}
