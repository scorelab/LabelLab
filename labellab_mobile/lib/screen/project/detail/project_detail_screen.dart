import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/member.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/detail/project._detail_bloc.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
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
                _state.project != null
                    ? _buildBody(context, _state)
                    : Container(),
              ],
            ),
          ),
          floatingActionButton: FloatingActionButton(
            child: Icon(Icons.file_upload),
            onPressed: () => _state.project != null ? _gotoUploadImage(context, _state.project.id): null,
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

  Widget _buildBody(BuildContext context, ProjectDetailState state) {
    return Column(
      children: <Widget>[
        state.project.description != null
            ? _buildInfo(context, state.project.description)
            : Container(),
        state.project.members != null
            ? _buildMembers(context, state.project.members)
            : Container(),
      ],
    );
  }

  Widget _buildInfo(BuildContext context, String description) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Text(
            "Info",
            style: Theme.of(context).textTheme.title,
          ),
          SizedBox(
            height: 8,
          ),
          Text(description),
        ],
      ),
    );
  }

  Widget _buildMembers(BuildContext context, List<Member> members) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.only(top: 8, left: 16, right: 16),
          child: Text(
            "Members",
            style: Theme.of(context).textTheme.title,
          ),
        ),
        Column(
          children: members.map((member) {
            return ListTile(
              title: Text(member.member.name),
              subtitle: Text(member.member.email),
            );
          }).toList(),
        ),
      ],
    );
  }

  void _gotoEditProject(BuildContext context, String id) {
    Application.router
        .navigateTo(context, "/project/edit/" + id)
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context).refresh();
    });
  }

  void _gotoUploadImage(BuildContext context, String id) {
    Application.router.navigateTo(context, "/project/upload/" + id).whenComplete(() {
      Provider.of<ProjectDetailBloc>(context).refresh();
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
              Provider.of<ProjectDetailBloc>(baseContext).delete();
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
