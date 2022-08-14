// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/issue.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/issue/issue_activity/issue_activity_bloc.dart';
import 'package:labellab_mobile/widgets/empty_placeholder.dart';
import 'package:labellab_mobile/widgets/issue_list_tile.dart';
import 'package:provider/provider.dart';

import 'issue_activity_state.dart';
import 'local_widgets/filter_issue_sheet.dart';

class IssueActivity extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final String projectId = Provider.of<IssueActivityBloc>(context).projectId;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: Text('All Issues', style: TextStyle(color: Colors.black)),
        centerTitle: true,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () {
              _openFiltersBottomSheet(context);
            },
            icon: Icon(
              Icons.settings,
              color: Colors.black,
            ),
          )
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          Provider.of<IssueActivityBloc>(context, listen: false).refresh();
        },
        child: StreamBuilder<IssueActivityState>(
          initialData: IssueActivityState.loading(),
          stream: Provider.of<IssueActivityBloc>(context).issues,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting ||
                !snapshot.hasData) {
               Provider.of<IssueActivityBloc>(context).refresh();
              return _loadingIndicator(context);
            }
            final _state = snapshot.data;
            
            return RefreshIndicator(
              onRefresh: () async {
                Provider.of<IssueActivityBloc>(context).refresh();
              },
              child: _state!.isLoading
                  ? _loadingIndicator(context)
                  : _state.issues!.isEmpty
                      ? EmptyPlaceholder(description: 'No issues available')
                      : Padding(
                          padding: const EdgeInsets.all(1.0),
                          child: _state.issues != null
                              ? Column(
                                  children: _state.issues!.map((issue) {
                                    return IssueListTile(
                                      issue,
                                      onItemTapped: () {
                                        _gotoIssueDetails(context, issue);
                                      },
                                      isCustomized: true,
                                    );
                                  }).toList(),
                                )
                              : Container(),
                        ),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        heroTag: "issue_add_tag",
        child: Icon(
          Icons.add,
          color: Colors.white,
        ),
        onPressed: () => _gotoAddIssue(context, projectId),
      ),
    );
  }

  Widget _loadingIndicator(BuildContext context) {
    return LinearProgressIndicator(
      backgroundColor: Theme.of(context).canvasColor,
    );
  }

  void _gotoAddIssue(BuildContext context, String projectId) {
    Application.router
        .navigateTo(context, "/issue/add/" + projectId)
        .whenComplete(() {
      Provider.of<IssueActivityBloc>(context, listen: false).refresh();
    });
  }

  void _gotoIssueDetails(BuildContext context, Issue issueId) {
    Application.router
        .navigateTo(
            context,
            "/issue/" +
                issueId.project_id.toString() +
                "/detail/" +
                issueId.id.toString())
        .whenComplete(() {
      Provider.of<IssueActivityBloc>(context, listen: false).refresh();
    });
  }

  void _openFiltersBottomSheet(BuildContext context) {
    String projectId =
        Provider.of<IssueActivityBloc>(context, listen: false).projectId;
    showModalBottomSheet(
        backgroundColor: Colors.transparent,
        context: context,
        builder: (ctx) {
          return Provider<IssueActivityBloc>(
              create: (context) => IssueActivityBloc(projectId),
              dispose: (context, bloc) => bloc.dispose(),
              child: FilterIssueSheet());
        }).then((issues) {
      if (issues != null) {
        Provider.of<IssueActivityBloc>(context, listen: false)
            .setCategoryIssues(issues);
      }
    });
  }

  User getCreatedIssueUser(List<User> users, String created_by) {
    final index = users.indexWhere((element) => element.id == created_by);

    return users[index];
  }
}
