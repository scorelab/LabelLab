import 'dart:async';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/model/issue.dart';
import 'package:labellab_mobile/screen/issue/issue_state.dart';

import '../../data/repository.dart';


class IssueBloc {
  Repository _repository = Repository();

  List<Issue>  _issues =[];
  bool _isLoading = false;
  String _projectId;

  IssueBloc(this._projectId) {
    _loadIssues(_projectId);
  }

  void refresh() {
    _loadIssues(_projectId);
  }

  void delete(String? id) {
  }

  // Issue stream
  StreamController<IssueState> _issueController =
      StreamController<IssueState>();

  Stream<IssueState> get issues => _issueController.stream;

  void _loadIssues(String projectId) {
    if (_isLoading) return;
    _isLoading = true;
    _setState(IssueState.loading(issues: _issues));
  _repository.getIssuesLocal().then((issues) { 
      this._issues = issues;
      _setState(IssueState.loading(issues: _issues));
    });
    _repository.getIssues(projectId).then((issues) {
      this._issues = issues;
      _setState(IssueState.success(_issues));
      _isLoading = false;
    }).catchError((err) {
      if (err is DioError) {
        _setState(
            IssueState.error(err.message.toString(), issues: _issues));
      } else {
        _issueController
            .add(IssueState.error(err.toString(), issues: _issues));
      }
      _isLoading = false;
    });

    
  }

  _setState(IssueState state) {
    if (!_issueController.isClosed) _issueController.add(state);
  }

  void dispose() {
    _issueController.close();
  }

  String get projectId => this._projectId;
}
