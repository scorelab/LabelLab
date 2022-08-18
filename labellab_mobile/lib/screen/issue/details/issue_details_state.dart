import 'package:labellab_mobile/model/issue.dart';
import 'package:labellab_mobile/model/user.dart';


class IssueDetailState {
  bool isLoading = false;

  String? error;
  Issue? issue;

  List<User>? users;

  IssueDetailState.loading() {
    isLoading = true;
  }

  IssueDetailState.error(this.error, );

  IssueDetailState.updateError(this.error,);

  IssueDetailState.success(this.issue);
  IssueDetailState.userList(this.issue,{this.users});
}
