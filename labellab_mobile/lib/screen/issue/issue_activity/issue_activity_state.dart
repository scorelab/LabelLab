import 'package:labellab_mobile/model/issue.dart';

class IssueActivityState {
  late bool isLoading;
  String? error;
  String? updateError;
  List<Issue>? issues;

  IssueActivityState.loading({this.issues}) {
    isLoading = true;
  }

  IssueActivityState.error(this.error, {this.issues}) {
    this.isLoading = false;
  }

  IssueActivityState.updateError(this.error, {this.issues}) {
    this.isLoading = false;
  }

  IssueActivityState.success(this.issues) {
    this.isLoading = false;
  }
}
