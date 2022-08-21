import 'dart:async';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/comment.dart';
import 'package:labellab_mobile/model/issue.dart';
import 'package:labellab_mobile/model/user.dart';

import 'issue_details_state.dart';

class IssueDetailBloc {
  Repository _repository = Repository();
  List<User> _users = [];
  Comment commentTosend = new Comment();

  String? projectId;
  String? issueId;

  Issue? _issue;
  bool _isLoading = false;

  IssueDetailBloc(this.projectId, this.issueId) {
    _loadIssue();
  }

  void refresh() {
    _loadIssue();
  }

  void delete() {
    _repository.deleteIssue(issueId!, projectId!);
  }

  void _loadIssue() {
    _users = [];
    if (_isLoading) return;
    _isLoading = true;
    _setState(IssueDetailState.loading());
    _repository.getIssue(projectId, issueId).then((issue) {
      this._issue = issue;
      _setState(IssueDetailState.success(issue));
      _repository.getUsers().then((users) {
        this._users = users;
        _setState(IssueDetailState.userList(issue, users: users));
        // getCreatedIssueUser(issue.created_by.toString());

        _isLoading = false;
      });
    }).catchError((err) {
      if (err is DioError) {
        _setState(IssueDetailState.error(err.message.toString()));
      } else {
        _setState(IssueDetailState.error(err.toString()));
      }
      _isLoading = false;
    });
  }

  _setState(IssueDetailState state) {
    if (!_stateController.isClosed) _stateController.add(state);
  }

  StreamController<IssueDetailState> _stateController =
      StreamController<IssueDetailState>();

  Stream<IssueDetailState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
  }

  void assignIssue(String projectId, String issueId, String assigneeId) {
    if (_isLoading) return;
    _isLoading = true;
    _repository.assignIssue(projectId, issueId, assigneeId).then((res) {
      _isLoading = false;
      // this._issue = issue;
      _setState(IssueDetailState.success(_issue));
    }).catchError((err) {
      _isLoading = false;
      _setState(IssueDetailState.error(err.toString()));
    });
  }

  void sendComment(String comment) {
    commentTosend.body = comment;
    _repository.postComment(commentTosend, issueId!);
  }

  void updateCommet(Comment comment, String issue_id) {
    _repository.updateComment(comment, issueId!);
    refresh();
  }

  void ddeleteComment(Comment comment, String issue_id) {
    _repository.deleteComment(comment, issueId!);
  }
}
