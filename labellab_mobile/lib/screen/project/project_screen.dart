import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/project_bloc.dart';
import 'package:labellab_mobile/screen/project/project_item.dart';
import 'package:labellab_mobile/screen/project/project_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:provider/provider.dart';

class ProjectScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Projects"),
        centerTitle: true,
        elevation: 2,
      ),
      body: StreamBuilder(
        stream: Provider.of<ProjectBloc>(context).projects,
        builder: (context, AsyncSnapshot<ProjectState> snapshot) {
          if (snapshot.hasData) {
            final ProjectState state = snapshot.data;
            return RefreshIndicator(
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
                          title: Text(state.error),
                        )
                      : Container(),
                  state.projects != null
                      ? Column(
                          children: state.projects
                              .map((project) => ProjectItem(
                                    project,
                                    onItemTapped: () {
                                      _gotoProjectDetail(context, project.id);
                                    },
                                    onEditSelected: () {
                                      _gotoEditProject(context, project.id);
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
            );
          } else {
            return Text("No data");
          }
        },
      ),
      floatingActionButton: FloatingActionButton(
        heroTag: "project_add_tag",
        child: Icon(Icons.add),
        onPressed: () => _gotoAddProject(context),
      ),
    );
  }

  void _gotoAddProject(BuildContext context) {
    Application.router.navigateTo(context, "/project/add").whenComplete(() {
      Provider.of<ProjectBloc>(context).refresh();
    });
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
        }).then((success) {
      if (success) {
        Navigator.pop(baseContext);
      }
    });
  }
}
