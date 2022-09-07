import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/comment.dart';
import 'package:labellab_mobile/model/issue.dart';
import 'package:labellab_mobile/model/mapper/issue_mapper.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/issue/details/issue_details_bloc.dart';
import 'package:labellab_mobile/screen/issue/details/issue_details_state.dart';
import 'package:labellab_mobile/screen/project/chat/local_widgets/message_input.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:provider/provider.dart';

import 'local_widget.dart/expnasion_tile.dart';
import 'package:labellab_mobile/widgets/color_box.dart' as coloredbox;

class IssueDetailScreen extends StatefulWidget {
  @override
  State<IssueDetailScreen> createState() => _IssueDetailScreenState();
}

class _IssueDetailScreenState extends State<IssueDetailScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();

  TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<IssueDetailState>(
      stream: Provider.of<IssueDetailBloc>(context).state,
      initialData: IssueDetailState.loading(),
      builder: (context, snapshot) {
        IssueDetailState _state = snapshot.data!;

        return Scaffold(
            key: _scaffoldKey,
            appBar: AppBar(
              backgroundColor: Colors.white,
              iconTheme: IconThemeData(color: Colors.black),
              actionsIconTheme: IconThemeData(color: Colors.black),
              elevation: 0,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(),
                centerTitle: true,
              ),
              actions: _buildActions(context, _state.issue),
            ),
            body: _state.issue != null && _state.users != null
                ? SingleChildScrollView(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
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
                            style: TextStyle(color: Colors.grey, fontSize: 18),
                          ),
                        ),
                        Divider(
                          height: 2,
                        ),
                        (_state.issue!.comments != null &&
                                _state.issue!.comments!.isNotEmpty)
                            ? ExpansionTile(
                                leading: Icon(Icons.comment),
                                trailing: Text(
                                    _state.issue!.comments!.length.toString()),
                                title: Text(
                                    "Comments"), // padding: const EdgeInsets.all(0),
                                children: [
                                  Container(
                                    // height: 50,
                                    child: Column(
                                      children: [
                                        MessageInput(
                                          _controller,
                                          _sendComment,
                                          list: _state.users,
                                        ),
                                        for (var comment
                                            in _state.issue!.comments!)
                                          _commentItem(context, comment,
                                              _state.issue!.created_by!),
                                      ],
                                    ),
                                  ),
                                ],
                              )
                            : ExpansionTile(
                                leading: Icon(Icons.comment),
                                trailing: Text(
                                    _state.issue!.comments!.length.toString()),
                                title: Text(
                                    "Comments"), // padding: const EdgeInsets.all(0),
                                children: [
                                  MessageInput(
                                    _controller,
                                    _sendComment,
                                    list: _state.users,
                                  )
                                ],
                              ),
                      ],
                    ),
                  )
                : Container());
      },
    );
  }

  void _sendComment(String comment) {
    if (comment.isEmpty) return;
    setState(() {
      Provider.of<IssueDetailBloc>(context, listen: false).sendComment(comment);
    });
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
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              RichText(
                text: TextSpan(
                    text: "#" + issue.id.toString() + " - ",
                    style: TextStyle(color: Colors.grey, fontSize: 20),
                    children: <TextSpan>[
                      TextSpan(
                        text: issue.issueTitle!,
                        style: Theme.of(context).textTheme.headline6,
                      ),
                    ]),
              ),
              Padding(
                padding: const EdgeInsets.only(right: 20),
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
            ],
          ),
          SizedBox(
            height: size.height / 50,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              coloredbox.ColoredBox(
                  IssueMapper.categoryToString(issue.issueCategory),
                  _getIcon(IssueMapper.categoryToString(issue.issueCategory)),
                  _getTextOrBorderColor(
                      IssueMapper.categoryToString(issue.issueCategory)),
                  _getTextOrBorderColor(
                      IssueMapper.categoryToString(issue.issueCategory)),
                  true),
              coloredbox.ColoredBox(
                  IssueMapper.priorityToString(issue.issuePriority),
                  Icons.show_chart,
                  _getPriorityTextColor(
                      IssueMapper.priorityToString(issue.issuePriority)),
                  _getPriorityBackgroundColor(
                      IssueMapper.priorityToString(issue.issuePriority)),
                  true),
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
              height: size.height / 60,
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

  Color _getPriorityBackgroundColor(String priority) {
    switch (priority) {
      case 'Low':
        return Colors.purple.withOpacity(0.3);
      case 'Medium':
        return Color(0xff0C7800).withOpacity(0.3);
      case 'Critical':
        return Color(0xff980000).withOpacity(0.3);
      case 'High':
        return Colors.orange.withOpacity(0.3);
      default:
        return Colors.black.withOpacity(0.3);
    }
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

  void _assignIssue(BuildContext context, Issue issue, User user) {
    String assignee_ID = user.id!;
    Provider.of<IssueDetailBloc>(context, listen: false).assignIssue(
      issue.project_id.toString(),
      issue.id.toString(),
      assignee_ID,
    );
    Application.router.pop(context);
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

  Widget _commentItem(BuildContext context, Comment comment, int userId) {
    return Padding(
      padding: const EdgeInsets.only(left: 20, top: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
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
                                  fontSize: 14.0,
                                  color: Colors.grey,
                                ),
                                children: [
                                  TextSpan(
                                    text: '@${comment.username}  ',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xff3D4A5A),
                                    ),
                                  ),
                                  TextSpan(
                                    text: timeAgo(
                                        DateTime.parse(comment.timestamp!)),
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 10.0,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      Container(
                        margin: EdgeInsets.only(right: 35),
                        child: Text(
                          comment.body!,
                          style: TextStyle(color: Colors.grey, fontSize: 15),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          userId == comment.userId
              ? Container(
                  // margin: EdgeInsets.only(left: 12),
                  child: PopupMenuButton<int>(
                    onSelected: (int value) async {
                      if (value == 0) {
                        final String? newText =
                            await _asyncInputDialog(context, comment);
                        setState(() {
                          comment.body = newText;
                          Provider.of<IssueDetailBloc>(context, listen: false)
                              .updateCommet(comment, comment.id.toString());
                        });
                      } else if (value == 1) {
                        setState(() {
                          Provider.of<IssueDetailBloc>(context, listen: false)
                              .ddeleteComment(comment, comment.id.toString());
                        });
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
                )
              : Container(),
        ],
      ),
    );
  }

  Future<String?> _asyncInputDialog(
      BuildContext context, Comment comment) async {
    String sampleText = comment.body!;
    return showDialog<String>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Update your comment'),
          content: new Row(
            children: <Widget>[
              new Expanded(
                  child: new TextFormField(
                initialValue: sampleText,
                autofocus: true,
                decoration: new InputDecoration(
                    focusColor: Colors.teal, labelText: 'Update Comment Here'),
                onChanged: (value) {
                  sampleText = value;
                },
              ))
            ],
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Ok'),
              onPressed: () {
                Navigator.of(context).pop(sampleText);
              },
            ),
          ],
        );
      },
    );
  }

  Color _getTextOrBorderColor(String category) {
    switch (category) {
      case 'General':
        return Color(0xff3A35C4);
      case 'Images':
        return Color(0xff0C7800);
      case 'Labels':
        return Color(0xff980000);
      case 'Models':
        return Color(0xffCBBD00);
      case 'Labelling':
        return Color(0xfff26d5b);
      default:
        return Colors.black;
    }
  }

  IconData _getIcon(String role) {
    switch (role) {
      case 'Images':
        return Icons.image;
      case 'Labels':
        return Icons.label;
      case 'Labelling':
        return Icons.image_search_rounded;
      case 'Models':
        return Icons.model_training;
      default:
        return Icons.people;
    }
  }

  Color _getPriorityTextColor(String priority) {
    switch (priority) {
      case 'Low':
        return Colors.purple;
      case 'Medium':
        return Color(0xff0C7800);
      case 'Critical':
        return Color(0xff980000);
      case 'High':
        return Colors.orange;
      default:
        return Colors.black;
    }
  }
}
