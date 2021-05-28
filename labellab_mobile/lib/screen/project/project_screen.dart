import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/project_bloc.dart';
import 'package:labellab_mobile/screen/project/project_item.dart';
import 'package:labellab_mobile/screen/project/project_search_screen.dart';
import 'package:labellab_mobile/screen/project/project_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:labellab_mobile/widgets/empty_placeholder.dart';
import 'package:provider/provider.dart';

import 'project_state.dart';

class ProjectScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: Provider.of<ProjectBloc>(context).projects,
      initialData: ProjectState.loading(),
      builder: (context, AsyncSnapshot<ProjectState> snapshot) {
        final ProjectState state = snapshot.data!;
        if (state.projects != null && state.projects!.isNotEmpty) {
          return Scaffold(
            appBar: AppBar(
              title: Text("Projects"),
              centerTitle: true,
              elevation: 0,
              actions: <Widget>[
                IconButton(
                    icon: Icon(Icons.search),
                    onPressed: () {
                      _gotoProjectSearch(context, state);
                    })
              ],
            ),
            body: RefreshIndicator(
              onRefresh: () async {
                Provider.of<ProjectBloc>(context).refresh();
              },
              child: ListView(
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
              ),
            ),
            floatingActionButton: FloatingActionButton(
              heroTag: "project_add_tag",
              child: Icon(
                Icons.add,
                color: Colors.white,
              ),
              onPressed: () => _gotoAddProject(context),
            ),
          );
        } else {
          return Scaffold(
            appBar: AppBar(
              title: Text("Projects"),
              centerTitle: true,
              elevation: 0,
            ),
            body:
                EmptyPlaceholder(description: "Your projects will appear here"),
            floatingActionButton: FloatingActionButton(
              heroTag: "project_add_tag",
              child: Icon(
                Icons.add,
                color: Colors.white,
              ),
              onPressed: () => _gotoAddProject(context),
            ),
          );
        }
      },
    );
  }

  void _gotoAddProject(BuildContext context) {
    Application.router.navigateTo(context, "/project/add").whenComplete(() {
      Provider.of<ProjectBloc>(context).refresh();
    });
  }

  void _gotoProjectSearch(BuildContext context, ProjectState _state) {
    showSearch(context: context, delegate: ProjectSearchScreen(_state));
  }

  void _gotoProjectDetail(BuildContext context, String id) {
    Application.router
        .navigateTo(context, "/project/detail/" + id)
        .whenComplete(() {
      Provider.of<ProjectBloc>(context).refresh();
    });
  }

  void _gotoEditProject(BuildContext context, String id) {
    Application.router
        .navigateTo(context, "/project/edit/" + id)
        .whenComplete(() {
      Provider.of<ProjectBloc>(context).refresh();
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
              Provider.of<ProjectBloc>(baseContext).delete(project.id);
              Navigator.of(context).pop(true);
            },
          );
        });
  }
}
