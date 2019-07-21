import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/image.dart' as LabelLab;
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
          body: CustomScrollView(
            slivers: <Widget>[
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
              _state.project != null
                  ? SliverList(
                      delegate: SliverChildListDelegate([
                        _state.project.description != null
                            ? _buildInfo(context, _state.project.description)
                            : Container(),
                        _state.project.images != null &&
                                _state.project.images.length > 0
                            ? Padding(
                                padding: const EdgeInsets.only(
                                    top: 8, left: 16, right: 16),
                                child: Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: <Widget>[
                                    Text(
                                      "Images",
                                      style: Theme.of(context).textTheme.title,
                                    ),
                                    _state.project.images.length > 8
                                        ? FlatButton(
                                            child: Text("More"),
                                            onPressed: () {},
                                          )
                                        : Container(),
                                  ],
                                ),
                              )
                            : Container(),
                      ]),
                    )
                  : SliverFillRemaining(),
              _state.project != null && _state.project.images != null
                  ? _buildImages(context, _state.project.images)
                  : SliverFillRemaining(),
              SliverList(
                delegate: SliverChildListDelegate([
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0, left: 16),
                    child: Text(
                      "Members",
                      style: Theme.of(context).textTheme.title,
                    ),
                  ),
                ]),
              ),
              _state.project != null && _state.project.members != null
                  ? _buildMembers(context, _state.project.members)
                  : SliverFillRemaining(),
            ],
          ),
          floatingActionButton: FloatingActionButton(
            child: Icon(Icons.file_upload),
            onPressed: () => _state.project != null
                ? _gotoUploadImage(context, _state.project.id)
                : null,
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

  Widget _buildImages(BuildContext context, List<LabelLab.Image> images) {
    return SliverPadding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      sliver: SliverGrid.count(
        mainAxisSpacing: 8,
        crossAxisSpacing: 8,
        crossAxisCount: 4,
        children: images.take(8).map((image) {
          return ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Container(
              width: 64,
              height: 64,
              child: Image(
                image: NetworkImage(
                  image.imageUrl,
                ),
                frameBuilder: (context, _, __, ___) => Container(
                  color: Colors.black12,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildMembers(BuildContext context, List<Member> members) {
    return SliverList(
      delegate: SliverChildListDelegate(
        members.map((member) {
          return ListTile(
            title: Text(member.member.name),
            subtitle: Text(member.member.email),
          );
        }).toList(),
      ),
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
    Application.router
        .navigateTo(context, "/project/upload/" + id)
        .whenComplete(() {
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
