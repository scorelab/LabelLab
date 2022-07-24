import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/issue.dart';
import 'package:labellab_mobile/model/mapper/issue_mapper.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/issue/details/issue_details_bloc.dart';
import 'package:labellab_mobile/screen/issue/details/issue_details_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:provider/provider.dart';

class IssueDetailScreen extends StatelessWidget {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    User? user,assignedUser;
    return StreamBuilder<IssueDetailState>(
      stream: Provider.of<IssueDetailBloc>(context).state,
      initialData: IssueDetailState.loading(),
      builder: (context, snapshot) {
        IssueDetailState _state = snapshot.data!;
        user = (_state.issue != null && _state.users != null)
            ? getCreatedIssueUser(
                _state.users!, _state.issue!.created_by.toString())
            : null;
        assignedUser = (_state.issue != null && _state.users != null)
            ? getCreatedIssueUser(
                _state.users!, _state.issue!.assignee_id.toString())
            : null;
        return Scaffold(
          key: _scaffoldKey,
          body: CustomScrollView(
            slivers: <Widget>[
              SliverAppBar(
                backgroundColor: Colors.white,
                iconTheme: IconThemeData(color: Colors.black),
                actionsIconTheme: IconThemeData(color: Colors.black),
                // expandedHeight: 200,
                elevation: 0,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  background: Container(),
                  centerTitle: true,
                  title: Text(
                    _state.issue != null
                        ? "Issue #" + _state.issue!.id!.toString()
                        : "",
                    // _state.issue != null ? _state.issue!.issueTitle! : "",
                    style: TextStyle(color: Colors.black),
                    textAlign: TextAlign.center,
                  ),
                ),
                actions: _buildActions(context, _state.issue),
              ),
              SliverList(
                delegate: SliverChildListDelegate([
                  _state.isLoading
                      ? LinearProgressIndicator(
                          backgroundColor: Theme.of(context).canvasColor,
                        )
                      : Container(
                          height: 6,
                        ),
                ]),
              ),
              _state.issue != null
                  ? SliverList(
                      delegate: SliverChildListDelegate([
                        _state.issue != null && user != null
                            ? _buildInfo(context, _state.issue!, user!)
                            : Container(),
                        _state.issue != null  && user != null && assignedUser != null
                            ? _buildOthers(context, _state.issue!, user!,assignedUser!) :Container(),
                      ]),
                    )
                  : SliverFillRemaining()
            ],
          ), //error here
        );
      },
    );
  }

  User? getCreatedIssueUser(List<User> users, String created_by) {
    final index = users.indexWhere((element) => element.id == created_by);
     return index != -1 ? users[index] : null;
  }

  Widget _buildInfo(BuildContext context, Issue issue, User user) {
    final size = MediaQuery.of(context).size;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    issue.issueTitle!,
                    style: Theme.of(context).textTheme.headline6,
                  ),
                  SizedBox(
                    height: 8,
                  ),
                  Text("reported " +
                      timeAgo(DateTime.parse(issue.created_At!)) +
                      " by " +
                      user.name!),
                  Text("last updated " +
                      timeAgo(DateTime.parse(issue.updated_At!))),
                ],
              ),
              SizedBox(
                width: size.width / 4,
              ),
              Align(
                alignment: Alignment.topCenter,
                child: CircleAvatar(
                  backgroundColor: Colors.black12,
                  radius: 32,
                  child: ClipOval(
                      child: Image(
                    width: 60,
                    height: 60,
                    image: CachedNetworkImageProvider(user.thumbnail!),
                    fit: BoxFit.cover,
                  )),
                ),
              ),
            ],
          ),
          SizedBox(
            height: 20,
          ),
          Divider(
            height: 5,
            color: Colors.black,
          ),
          Text(
            "Description",
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          Container(
            margin: EdgeInsets.all(10),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.black),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Center(
              child: Text(issue.description!, style: TextStyle(fontSize: 20)),
            ),
          ),
          Divider(
            height: 5,
            color: Colors.black,
          ),
        ],
      ),
    );
  }

  Widget _buildOthers(BuildContext context, Issue issue, User user,User assigenedUser){
    return  Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                children: [
                  Text("Priroty: " + IssueMapper.priorityToString(issue.issuePriority)),
                  (assigenedUser!=null) ?Text("Assigned to : " +  assigenedUser.name!):Text("Assigned to : " +  "null"),
                ],
              ),
              Column(
                children: [
                  Text("catergory: " + IssueMapper.categoryToString(issue.issueCategory)),
                 Text("Status: " + IssueMapper.statusToString(issue.issueStatus)),
                ],
              )
            ],
          );
  }

  

  List<Widget> _buildActions(BuildContext context, Issue? issue) {
    if (issue == null) return [];
    return [
      PopupMenuButton<int>(
        onSelected: (int value) {
          if (value == 0) {
            _gotoEditIssue(
                context, issue.id!.toString(), issue.project_id!.toString());
            print(issue.id!.toString());
            print(issue.project_id!.toString());
          } else if (value == 1) {
            _showIssueDeleteConfirmation(context, issue);
          }
        },
        itemBuilder: (context) {
          return [
            PopupMenuItem(
              value: 0,
              child: Text("Edit"),
            ),
            PopupMenuItem(
              value: 1,
              child: Text("Delete"),
            ),
          ];
        },
      ),
    ];
  }

  void _showIssueDeleteConfirmation(BuildContext baseContext, Issue issue) {
    showDialog<bool>(
        context: baseContext,
        builder: (context) {
          return DeleteConfirmDialog(
            name: issue.issueTitle,
            onCancel: () => Navigator.pop(context),
            onConfirm: () {
              Provider.of<IssueDetailBloc>(baseContext, listen: false).delete();
              Navigator.of(context).pop(true);
            },
          );
        }).then((success) {
      if (success != null && success) {
        Navigator.pop(baseContext);
      }
    });
  }

  void _gotoEditIssue(BuildContext context, String id, String project_id) {
    Application.router
        .navigateTo(context, "/issue/" + project_id + "/edit/" + id)
        .whenComplete(() {
      Provider.of<IssueDetailBloc>(context, listen: false).refresh();
    });
  }

  String timeAgo(DateTime d) {
    Duration diff = DateTime.now().difference(d);
    if (diff.inDays > 365)
      return "${(diff.inDays / 365).floor()} ${(diff.inDays / 365).floor() == 1 ? "year" : "years"} ago";
    if (diff.inDays > 30)
      return "${(diff.inDays / 30).floor()} ${(diff.inDays / 30).floor() == 1 ? "month" : "months"} ago";
    if (diff.inDays > 7)
      return "${(diff.inDays / 7).floor()} ${(diff.inDays / 7).floor() == 1 ? "week" : "weeks"} ago";
    if (diff.inDays > 0)
      return "${diff.inDays} ${diff.inDays == 1 ? "day" : "days"} ago";
    if (diff.inHours > 0)
      return "${diff.inHours} ${diff.inHours == 1 ? "hour" : "hours"} ago";
    if (diff.inMinutes > 0)
      return "${diff.inMinutes} ${diff.inMinutes == 1 ? "minute" : "minutes"} ago";
    return "just now";
  }
}
