import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/image.dart' as LabelLab;
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/member.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/add_edit_label/add_edit_label_dialog.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_bloc.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_state.dart';
import 'package:labellab_mobile/state/auth_state.dart';
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
                  centerTitle: true,
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
                        Padding(
                          padding: const EdgeInsets.only(
                              top: 8, left: 16, right: 16),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              Text(
                                "Images",
                                style: Theme.of(context).textTheme.title,
                              ),
                              _state.project.images.length > 8
                                  ? FlatButton(
                                      child: Text("More"),
                                      onPressed: () => _gotoMoreImagesScreen(
                                        context,
                                        _state.project.id,
                                      ),
                                    )
                                  : Container(),
                            ],
                          ),
                        ),
                      ]),
                    )
                  : SliverFillRemaining(),
              _state.project != null && _state.project.images != null
                  ? _buildImages(
                      context, _state.project.id, _state.project.images)
                  : SliverFillRemaining(),
              _state.project != null && _state.project.labels != null
                  ? _buildLabels(
                      context, _state.project.id, _state.project.labels)
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
            child: Icon(
              Icons.file_upload,
              color: Colors.white,
            ),
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
                  _gotoAddMemberScreen(context, project);
                } else if (value == 1) {
                  _showProjectDeleteConfirmation(context, project);
                }
              },
              itemBuilder: (context) {
                return [
                  PopupMenuItem(
                    value: 0,
                    child: Text("Add member"),
                  ),
                  PopupMenuItem(
                    value: 1,
                    child: Text("Delete"),
                  ),
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

  Widget _buildImages(
      BuildContext context, String projectId, List<LabelLab.Image> images) {
    return images.length > 0
        ? SliverPadding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            sliver: SliverGrid.count(
              mainAxisSpacing: 8,
              crossAxisSpacing: 8,
              crossAxisCount: 4,
              children: images.take(8).map((image) {
                return InkWell(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      width: 64,
                      height: 64,
                      color: Colors.black12,
                      child: Stack(
                        fit: StackFit.expand,
                        children: <Widget>[
                          Image(
                            image: CachedNetworkImageProvider(
                              image.imageUrl,
                            ),
                            fit: BoxFit.cover,
                          ),
                          Container(
                            decoration: BoxDecoration(
                                gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [
                                  Colors.black38,
                                  Color.fromRGBO(255, 255, 255, 0)
                                ])),
                          ),
                          Positioned(
                            top: 8,
                            right: 8,
                            child: Text(
                              image.labels != null
                                  ? image.labels.length != 1
                                      ? image.labels.length.toString() +
                                          " Labels"
                                      : "1 Label"
                                  : "",
                              style:
                                  TextStyle(color: Colors.white, fontSize: 14),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  onTap: () => _gotoViewImage(context, projectId, image.id),
                );
              }).toList(),
            ),
          )
        : SliverPadding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildErrorPlaceholder(context, "No images yet"),
              ]),
            ),
          );
  }

  Widget _buildLabels(
      BuildContext context, String projectId, List<Label> labels) {
    return SliverPadding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      sliver: SliverList(
        delegate: SliverChildListDelegate([
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(
                "Labels",
                style: Theme.of(context).textTheme.title,
              ),
              FlatButton.icon(
                icon: Icon(Icons.add),
                label: Text("Add"),
                onPressed: () => _showAddEditLabelModel(context, null),
              ),
            ],
          ),
          labels.length > 0
              ? Wrap(
                  spacing: 8,
                  children: labels.map((label) {
                    return InkWell(
                      child: Chip(
                        label: Text(label.name),
                        deleteIcon: Icon(Icons.cancel),
                        onDeleted: () =>
                            _showLabelDeleteConfirmation(context, label),
                      ),
                      onTap: () => _showAddEditLabelModel(context, label),
                    );
                  }).toList(),
                )
              : _buildErrorPlaceholder(context, "No labels yet"),
        ]),
      ),
    );
  }

  Widget _buildMembers(BuildContext context, List<Member> members) {
    final User _currentUser = Provider.of<AuthState>(context).user;
    return SliverPadding(
      padding: EdgeInsets.only(bottom: 72),
      sliver: SliverList(
        delegate: SliverChildListDelegate(
          members.map((member) {
            return ListTile(
              title: Text(member.member.name),
              subtitle: Text(member.member.email),
              trailing: _currentUser.id != member.member.id
                  ? PopupMenuButton<int>(
                      onSelected: (value) {
                        if (value == 0) {
                          _showRemoveMemberConfirmation(context, member.member);
                        }
                      },
                      itemBuilder: (context) {
                        return [
                          PopupMenuItem(
                            value: 0,
                            child: Text("Remove"),
                          )
                        ];
                      },
                    )
                  : null,
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildErrorPlaceholder(BuildContext context, String description) {
    return Row(
      children: <Widget>[
        Icon(
          Icons.error,
          size: 28,
          color: Colors.black45,
        ),
        SizedBox(
          width: 8,
        ),
        Text(
          description,
          style: TextStyle(color: Colors.black45),
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

  void _gotoViewImage(BuildContext context, String projectId, String imageId) {
    Application.router
        .navigateTo(context, "/project/$projectId/view/$imageId")
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context).refresh();
    });
  }

  void _gotoUploadImage(BuildContext context, String id) {
    Application.router
        .navigateTo(context, "/project/$id/upload")
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context).refresh();
    });
  }

  void _gotoAddMemberScreen(BuildContext context, Project project) {
    Application.router
        .navigateTo(context, "/project/${project.id}/add")
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context).refresh();
    });
  }

  void _gotoMoreImagesScreen(BuildContext context, String projectId) {
    Application.router
        .navigateTo(context, "/project/$projectId/images")
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context).refresh();
    });
  }

  void _showProjectDeleteConfirmation(
      BuildContext baseContext, Project project) {
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
      if (success != null && success) {
        Navigator.pop(baseContext);
      }
    });
  }

  void _showRemoveMemberConfirmation(BuildContext baseContext, User user) {
    showDialog<bool>(
        context: baseContext,
        builder: (context) {
          return DeleteConfirmDialog(
            name: user.name,
            onCancel: () => Navigator.pop(context),
            onConfirm: () {
              Provider.of<ProjectDetailBloc>(baseContext)
                  .removeUser(user.email);
              Navigator.of(context).pop(true);
            },
          );
        });
  }

  void _showLabelDeleteConfirmation(BuildContext baseContext, Label label) {
    showDialog<bool>(
        context: baseContext,
        builder: (context) {
          return DeleteConfirmDialog(
            name: label.name,
            onCancel: () => Navigator.pop(context),
            onConfirm: () {
              Provider.of<ProjectDetailBloc>(baseContext)
                  .deleteLabel(label.labelID);
              Navigator.of(context).pop(true);
            },
          );
        });
  }

  void _showAddEditLabelModel(BuildContext baseContext, Label label) {
    showDialog<bool>(
      context: baseContext,
      builder: (context) {
        return AddEditLabelDialog(
          Provider.of<ProjectDetailBloc>(baseContext).projectId,
          label: label,
        );
      },
    ).then((bool isSuccess) {
      if (isSuccess) {
        Provider.of<ProjectDetailBloc>(baseContext).refresh();
      }
    });
  }
}
