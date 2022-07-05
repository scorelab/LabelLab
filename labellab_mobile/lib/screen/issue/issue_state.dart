import 'package:labellab_mobile/model/issue.dart';

class IssueState {
  late bool isLoading;
  String? error;
  String? updateError;
  List<Issue>? issues;

  IssueState.loading({this.issues}) {
    isLoading = true;
  }

  IssueState.error(this.error, {this.issues}) {
    this.isLoading = false;
  }

  IssueState.updateError(this.error, {this.issues}) {
    this.isLoading = false;
  }

  IssueState.success(this.issues) {
    this.isLoading = false;
  }
}