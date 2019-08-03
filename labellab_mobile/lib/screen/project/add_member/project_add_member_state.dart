import 'package:labellab_mobile/model/user.dart';

class ProjectAddMemberState {
  bool isLoading = false;
  bool fetchSuccess = false;
  bool setSuccess = false;
  String error;
  User user;

  ProjectAddMemberState.initial();
  ProjectAddMemberState.loading({this.user}) {
    isLoading = true;
  }

  ProjectAddMemberState.error(this.error, {this.user});

  ProjectAddMemberState.successFetch(this.user) {
    this.fetchSuccess = true;
  }

  ProjectAddMemberState.successSet(this.user) {
    this.fetchSuccess = true;
    this.setSuccess = true;
  }
}
