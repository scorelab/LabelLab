import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../model/project.dart';
import '../../routing/application.dart';
import '../../widgets/delete_confirm_dialog.dart';
import '../../widgets/empty_placeholder.dart';
import 'project_bloc.dart';
import 'project_item.dart';
import 'project_state.dart';

class ProjectSearchScreen extends SearchDelegate {
  ProjectState state;

  ProjectSearchScreen(this.state);

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: AnimatedIcon(
          icon: AnimatedIcons.menu_close,
          progress: transitionAnimation,
        ),
        onPressed: () {
          query = '';
        },
      )
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: Icon(Icons.arrow_back),
      onPressed: () {
        Navigator.of(context).pop();
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    return state.projects != null && state.projects!.isNotEmpty
        ? ListView(
            children: <Widget>[
              state.isLoading
                  ? LinearProgressIndicator(
                      backgroundColor: Theme.of(context).canvasColor,
                    )
                  : Container(
                      height: 6,
                    ),
              state.error != null
                  ? ListTile(
                      title: Text(state.error!),
                    )
                  : Container(),
              state.projects != null
                  ? Column(
                      children: state.projects!
                          .where((project) =>
                              project.name!
                                  .toLowerCase()
                                  .contains(query.toLowerCase()) ||
                              project.description!
                                  .toLowerCase()
                                  .contains(query.toLowerCase()))
                          .map((project) => ProjectItem(
                                project,
                                onItemTapped: () {
                                  _gotoProjectDetail(context, project.id!);
                                },
                                onEditSelected: () {
                                  _gotoEditProject(context, project.id!);
                                },
                                onDeleteSelected: () {
                                  _showDeleteConfirmation(context, project);
                                },
                              ))
                          .toList(),
                    )
                  : Container(),
            ],
          )
        : EmptyPlaceholder(description: "Your projects will appear here");
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    return state.projects != null && state.projects!.isNotEmpty
        ? ListView(
            children: <Widget>[
              state.isLoading
                  ? LinearProgressIndicator(
                      backgroundColor: Theme.of(context).canvasColor,
                    )
                  : Container(
                      height: 6,
                    ),
              state.error != null
                  ? ListTile(
                      title: Text(state.error!),
                    )
                  : Container(),
              state.projects != null
                  ? Column(
                      children: state.projects!
                          .where((project) =>
                              project.name!
                                  .toLowerCase()
                                  .contains(query.toLowerCase()) ||
                              project.description!
                                  .toLowerCase()
                                  .contains(query.toLowerCase()))
                          .map((project) => ProjectItem(
                                project,
                                onItemTapped: () {
                                  _gotoProjectDetail(context, project.id!);
                                },
                                shouldHaveOptions: false,
                              ))
                          .toList(),
                    )
                  : Container(),
            ],
          )
        : EmptyPlaceholder(description: "Your projects will appear here");
  }

  void _gotoProjectDetail(BuildContext context, String id) {
    Application.router
        .navigateTo(context, "/project/detail/" + id)
        .whenComplete(() {
      Provider.of<ProjectBloc>(context, listen: false).refresh();
    });
  }

  void _gotoEditProject(BuildContext context, String id) {
    Application.router
        .navigateTo(context, "/project/edit/" + id)
        .whenComplete(() {
      Provider.of<ProjectBloc>(context, listen: false).refresh();
    });
  }

  void _showDeleteConfirmation(BuildContext baseContext, Project project) {
    showDialog<bool>(
        context: baseContext,
        builder: (context) {
          return DeleteConfirmDialog(
            name: project.name,
            onCancel: () => Navigator.pop(context),
            onConfirm: () {
              Provider.of<ProjectBloc>(baseContext, listen: false)
                  .delete(project.id);
              Navigator.of(context).pop(true);
            },
          );
        });
  }
}
