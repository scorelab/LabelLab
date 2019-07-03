import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/detail/project._detail_bloc.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_state.dart';
import 'package:provider/provider.dart';

class ProjectDetailScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<ProjectDetailState>(
      stream: Provider.of<ProjectDetailBloc>(context).state,
      initialData: ProjectDetailState.loading(),
      builder: (context, snapshot) {
        ProjectDetailState _state = snapshot.data;
        return Scaffold(
          body: NestedScrollView(
            headerSliverBuilder:
                (BuildContext context, bool innerBoxIsScrolled) {
              return <Widget>[
                SliverAppBar(
                  expandedHeight: 200,
                  elevation: 2,
                  pinned: true,
                  flexibleSpace: FlexibleSpaceBar(
                    title: Text(
                      _state.project != null ? _state.project.name : "",
                    ),
                  ),
                  actions: _buildActions(context, _state.project),
                ),
              ];
            },
            body: Column(
              children: <Widget>[
                _state.isLoading
                    ? LinearProgressIndicator(
                        backgroundColor: Theme.of(context).canvasColor,
                      )
                    : Container(
                        height: 6,
                      ),
                Text("Sample Text"),
              ],
            ),
          ),
        );
      },
    );
  }

  List<Widget> _buildActions(BuildContext context, Project project) {
    return project != null
        ? [
            IconButton(
              icon: Icon(Icons.edit),
              onPressed: () => _gotoEditProject(context, project.id),
            ),
            PopupMenuButton<int>(
              onSelected: (int value) {
                if (value == 0) {
                  _showDeleteConfirmation(context, project);
                }
              },
              itemBuilder: (context) {
                return [
                  PopupMenuItem(
                    value: 0,
                    child: Text("Delete"),
                  )
                ];
              },
            ),
          ]
        : [];
  }

  void _gotoEditProject(BuildContext context, String id) {
    Application.router
        .navigateTo(context, "/project/edit/" + id)
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context).refresh();
    });
  }

  void _showDeleteConfirmation(BuildContext baseContext, Project project) {
    showDialog<bool>(
        context: baseContext,
        builder: (context) {
          return AlertDialog(
            title: Text("Delete ${project.name}"),
            content: Text("This can't be undone. Are you sure?"),
            actions: <Widget>[
              FlatButton(
                child: new Text("Cancel"),
                onPressed: () {
                  Navigator.of(context).pop(false);
                },
              ),
              FlatButton(
                child: new Text("Delete"),
                onPressed: () {
                  Provider.of<ProjectDetailBloc>(baseContext).delete();
                  Navigator.of(context).pop(true);
                },
              ),
            ],
          );
        }).then((success) {
      if (success) {
        Navigator.pop(baseContext);
      }
    });
  }
}
