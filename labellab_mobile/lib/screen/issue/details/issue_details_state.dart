import '../../../model/issue.dart';

class IssueDetailState {
  bool isLoading = false;

  String? error;
  Issue? issue;


  IssueDetailState.loading({this.issue}) {
    isLoading = true;
  }

  IssueDetailState.error(this.error, {this.issue});

  IssueDetailState.updateError(this.error, {this.issue});
 

  IssueDetailState.success(this.issue);
}