import 'package:labellab_mobile/model/user.dart';

import '../../../model/issue.dart';

class IssueDetailState {
  bool isLoading = false;

  String? error;
  Issue? issue;

  List<User>? users;

  IssueDetailState.loading({this.issue}) {
    isLoading = true;
  }

  IssueDetailState.error(this.error, {this.issue});

  IssueDetailState.updateError(this.error, {this.issue});

  IssueDetailState.success(this.issue);
  IssueDetailState.userList(this.issue,{this.users});
}
