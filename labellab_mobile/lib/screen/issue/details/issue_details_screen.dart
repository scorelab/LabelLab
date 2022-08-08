import 'dart:math';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
// import 'package:intl/intl.dart';
import 'package:labellab_mobile/model/comment.dart';
import 'package:labellab_mobile/model/issue.dart';
import 'package:labellab_mobile/model/mapper/issue_mapper.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/issue/details/issue_details_bloc.dart';
import 'package:labellab_mobile/screen/issue/details/issue_details_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:provider/provider.dart';

import 'local_widget.dart/expnasion_tile.dart';

class IssueDetailScreen extends StatelessWidget {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    bool _selectedMore = false;

    return StreamBuilder<IssueDetailState>(
      stream: Provider.of<IssueDetailBloc>(context).state,
      initialData: IssueDetailState.loading(),
      builder: (context, snapshot) {
        IssueDetailState _state = snapshot.data!;

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
                        _state.issue != null && _state.users != null
                            ? _buildInfo(context, _state.issue!, _state.users!)
                            : Container(),
                        _state.issue != null && _state.users != null
                            ? _buildOthers(
                                context, _state.issue!, _state.users!)
                            : Container(),
                        Padding(
                          padding: const EdgeInsets.symmetric(
                              vertical: 8.0, horizontal: 16),
                          child: ExpandableText(issue: _state.issue!),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(
                              vertical: 8.0, horizontal: 16),
                          child: Text(
                            "Description:",
                            style: TextStyle(color: Colors.grey, fontSize: 15),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(
                              vertical: 8.0, horizontal: 16),
                          child: Text(
                            _state.issue!.description!,
                            style: Theme.of(context).textTheme.headline6,
                          ),
                        ),
                        Divider(
                          height: 2,
                        ),
                        (_state.issue!.comments != null &&
                                _state.issue!.comments!.isNotEmpty)
                            ? Container(
                                // height: min(
                                //     200, _state.issue!.comments!.length * 40),
                                child: ExpansionTile(
                                  leading: Icon(Icons.comment),
                                  trailing: Text(_state.issue!.comments!.length
                                      .toString()),
                                  title: Text(
                                      "Comments"), // padding: const EdgeInsets.all(0),
                                  children: [
                                    for (var comment in _state.issue!.comments!)
                                      _commentItem(context, comment)
                                  ],
                                ),
                              )
                            : _buildCommentPlaceholder(
                                context, "No Comments yet"),
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

  Widget _buildInfo(BuildContext context, Issue issue, List<User> users) {
    final size = MediaQuery.of(context).size;
    User? user;
    user = getCreatedIssueUser(users, issue.created_by.toString());
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3, horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  RichText(
                    text: TextSpan(
                        text: "#" + issue.id.toString() + " -",
                        style: TextStyle(color: Colors.grey, fontSize: 20),
                        children: <TextSpan>[
                          TextSpan(
                            text: issue.issueTitle!,
                            style: Theme.of(context).textTheme.headline6,
                          ),
                        ]),
                  ),
                  SizedBox(height: size.height/16,),
                  RichText(
                    text: TextSpan(
                        text: "Status:",
                        style: TextStyle(color: Colors.grey, fontSize: 15),
                        children: <TextSpan>[
                          TextSpan(
                            text:
                                IssueMapper.statusToString(issue.issueStatus!),
                            style: TextStyle(
                                color: _getStatusTextColor(
                                    IssueMapper.statusToString(
                                        issue.issueStatus!)),
                                fontSize: 20),
                          ),
                        ]),
                  ),
                ],
              ),
              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: CircleAvatar(
                      backgroundColor: Colors.black12,
                      radius: 30,
                      child: ClipOval(
                          child: Image(
                        width: 60,
                        height: 60,
                        image: CachedNetworkImageProvider(user!.thumbnail!),
                        fit: BoxFit.cover,
                      )),
                    ),
                  ),
                  
                  Row(
                    children: [
                      Icon(
                        _getPrirotyIconColor(
                            IssueMapper.priorityToString(issue.issuePriority)),
                        color: Colors.red,
                      ),
                      SizedBox(
                        width: size.width / 40,
                      ),
                      Text(
                        IssueMapper.statusToString(issue.issueStatus!),
                        style: TextStyle(
                            color: _getPrirotyTextColor(
                                IssueMapper.statusToString(issue.issueStatus!)),
                            fontSize: 20),
                      ),
                    ],
                  )
                ],
              ),
              // SizedBox(
              //   width: size.width / 3.2,
              // ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOthers(BuildContext context, Issue issue, List<User> users) {
    final size = MediaQuery.of(context).size;
    User? user, assignedUser;
    user = getCreatedIssueUser(users, issue.created_by.toString());
    assignedUser = getCreatedIssueUser(users, issue.assignee_id.toString());
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16),
      child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Reporter:",
              style: TextStyle(color: Colors.grey, fontSize: 15),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Align(
                    alignment: Alignment.topCenter,
                    child: CircleAvatar(
                      backgroundColor: Colors.black12,
                      radius: 25,
                      child: ClipOval(
                        child: Image(
                          width: 60,
                          height: 60,
                          image: CachedNetworkImageProvider(user!.thumbnail!),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(
                    width: size.width / 40,
                  ),
                  Text(
                    user.name!,
                    style: Theme.of(context).textTheme.headline6,
                  ),
                ],
              ),
            ),
            SizedBox(
              height: size.height / 30,
            ),
            Text(
              "Assignee:",
              style: TextStyle(color: Colors.grey, fontSize: 15),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: assignedUser != null
                  ? Row(
                      children: [
                        Align(
                            alignment: Alignment.topCenter,
                            child: CircleAvatar(
                              backgroundColor: Colors.black12,
                              radius: 25,
                              child: ClipOval(
                                  child: Image(
                                width: 60,
                                height: 60,
                                image: CachedNetworkImageProvider(
                                    assignedUser.thumbnail!),
                                fit: BoxFit.cover,
                              )),
                            )),
                        SizedBox(
                          width: size.width / 40,
                        ),
                        Text(
                          assignedUser.name!,
                          style: Theme.of(context).textTheme.headline6,
                        )
                      ],
                    )
                  : InkWell(
                      onTap: () {
                        _assignIssue(context, issue, user!);
                      },
                      child: Row(
                        children: [
                          Icon(
                            Icons.person_add,
                            color: Colors.teal,
                          ),
                          SizedBox(
                            width: size.width / 40,
                          ),
                          Text(
                            "Assigne to Yourself",
                            style: TextStyle(color: Colors.grey, fontSize: 15),
                          ),
                        ],
                      ),
                    ),
            ),
          ]),
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

  Widget _buildCommentPlaceholder(BuildContext context, String description) {
    return ExpansionTile(
      leading: Icon(Icons.comment),
      trailing: Text(description),
      title: Text("Comments"), // padding: const EdgeInsets.all(0),
    );
  }

  void _assignIssue(BuildContext context, Issue issue, User user) {
    String assignee_ID = user.id!;
    Provider.of<IssueDetailBloc>(context, listen: false).assignIssue(
      issue.project_id.toString(),
      issue.id.toString(),
      assignee_ID,
    );

    Provider.of<IssueDetailBloc>(context, listen: false).refresh();
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

  Widget _commentItem(BuildContext context, Comment comment) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Align(
                  alignment: Alignment.topCenter,
                  child: CircleAvatar(
                    backgroundColor: Colors.black12,
                    radius: 20,
                    child: ClipOval(
                        child: Image(
                      width: 60,
                      height: 60,
                      image: CachedNetworkImageProvider(comment.thumbnail!),
                      fit: BoxFit.cover,
                    )),
                  ),
                ),
                SizedBox(
                  width: 10.0,
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: RichText(
                              text: TextSpan(
                                style: TextStyle(
                                  fontFamily: 'Nunito',
                                  fontSize: 12.0,
                                  color: Colors.grey,
                                ),
                                children: [
                                  TextSpan(
                                    text: '${comment.username} ',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xff3D4A5A),
                                    ),
                                  ),
                                  TextSpan(
                                    text: '${comment.body}',
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      Text(
                        timeAgo(DateTime.parse(comment.timestamp!)),
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 10.0,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            width: 10.0,
          ),
          Align(
            // alignment: Alignment.,
            child: Container(
              height: 10,
              width: 10,
              child: PopupMenuButton<int>(
                onSelected: (int value) {
                  if (value == 0) {
                  } else if (value == 1) {
                    // _showIssueDeleteConfirmation(context, issue);
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
            ),
          ),
        ],
      ),
    );
  }
}

Color _getStatusTextColor(String category) {
  switch (category) {
    case 'Review':
      return Color(0xff3A35C4);
    case 'Done':
      return Color(0xff0C7800);
    case 'Closed':
      return Color(0xff980000);
    case 'In Progress':
      return Color(0xffCBBD00);
    case 'Open':
      return Color(0xfff26d5b);
    default:
      return Colors.black;
  }
}

Color _getPrirotyTextColor(String category) {
  switch (category) {
    case 'Low':
      return Colors.grey.withOpacity(0.3);
    case 'Medium':
      return Color(0xff0C7800).withOpacity(0.3);
    case 'Critical':
      return Color(0xff980000).withOpacity(0.3);
    case 'High':
      return Color(0xffCBBD00).withOpacity(0.3);
    default:
      return Colors.black.withOpacity(0.3);
  }
}

IconData _getPrirotyIconColor(String category) {
  switch (category) {
    case 'Low':
      return Icons.network_wifi_2_bar_outlined;
    case 'Medium':
      return Icons.priority_high;
    case 'Critical':
      return Icons.info;
    case 'High':
      return Icons.network_wifi_2_bar_rounded;
    default:
      return Icons.low_priority;
  }
}
