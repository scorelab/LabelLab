import 'dart:math';
import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/group.dart';
import 'package:labellab_mobile/model/image.dart' as LabelLab;
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/mapper/ml_model_mapper.dart';
import 'package:labellab_mobile/model/member.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/add_edit_group/add_edit_group.dart';
import 'package:labellab_mobile/screen/project/add_edit_label/add_edit_label_dialog.dart';
import 'package:labellab_mobile/screen/project/add_edit_model/add_edit_model_dialog.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_bloc.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_state.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:labellab_mobile/widgets/group_item.dart';
import 'package:logger/logger.dart';
import 'package:provider/provider.dart';

class ProjectDetailScreen extends StatelessWidget {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<ProjectDetailState>(
      stream: Provider.of<ProjectDetailBloc>(context).state,
      initialData: ProjectDetailState.loading(),
      builder: (context, snapshot) {
        ProjectDetailState _state = snapshot.data;
        bool _hasImages =
            (_state.project != null) ? _state.project.images.length > 0 : false;
        return Scaffold(
          key: _scaffoldKey,
          body: CustomScrollView(
            slivers: <Widget>[
              SliverAppBar(
                backgroundColor: Theme.of(context).accentColor,
                iconTheme: IconThemeData(color: Colors.white),
                actionsIconTheme: IconThemeData(color: Colors.white),
                expandedHeight: 200,
                elevation: 2,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  background: _hasImages ? _buildCover(_state) : Container(),
                  centerTitle: true,
                  title: Text(
                    _state.project != null ? _state.project.name : "",
                    style: TextStyle(color: Colors.white),
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
                              Text("Images",
                                  style: Theme.of(context).textTheme.headline6),
                              Container(
                                child: Row(
                                  children: <Widget>[
                                    _state.project.images.length > 8
                                        ? FlatButton(
                                            child: Text("More"),
                                            onPressed: () =>
                                                _gotoMoreImagesScreen(
                                              context,
                                              _state.project.id,
                                            ),
                                          )
                                        : Container(),
                                    _state.isSelecting
                                        ? PopupMenuButton<int>(
                                            child: Container(
                                              child:
                                                  Icon(Icons.arrow_drop_down),
                                            ),
                                            onSelected: (int index) =>
                                                _onImageAction(context, index),
                                            itemBuilder:
                                                (BuildContext context) =>
                                                    _buildImageActions(context),
                                          )
                                        : Container()
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ]),
                    )
                  : SliverFillRemaining(),
              _state.project != null && _state.project.images != null
                  ? _buildImages(
                      context,
                      _state.project.id,
                      _state.project.images,
                      _state.isSelecting,
                      _state.selectedImages)
                  : SliverFillRemaining(),
              _state.project != null
                  ? _buildGroupsHeading(context)
                  : SliverFillRemaining(),
              _state.project != null && _state.project.groups != null
                  ? _buildGroups(
                      context, _state.project.id, _state.project.groups)
                  : SliverFillRemaining(),
              _state.project != null
                  ? _buildLabelsHeading(context)
                  : SliverFillRemaining(),
              _state.project != null && _state.project.labels != null
                  ? _buildLabels(
                      context, _state.project.images, _state.project.labels)
                  : SliverFillRemaining(),
              _state.project != null
                  ? _buildModelsHeading(context)
                  : SliverFillRemaining(),
              _state.project != null && _state.project.models != null
                  ? _buildModels(
                      context, _state.project.id, _state.project.models)
                  : SliverFillRemaining,
              SliverList(
                delegate: SliverChildListDelegate([
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0, left: 16),
                    child: Text(
                      "Members",
                      style: Theme.of(context).textTheme.headline6,
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

  Widget _buildCover(ProjectDetailState state) {
    return Container(
      child: Row(
        children: state.project.images
            .sublist(0, min(state.project.images.length, 4))
            .map(
              (image) => Expanded(
                child: Container(
                  decoration: BoxDecoration(
                      image: DecorationImage(
                          image: CachedNetworkImageProvider(image.imageUrl),
                          fit: BoxFit.cover)),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 8.0, sigmaY: 8.0),
                    child: Container(
                      decoration:
                          BoxDecoration(color: Colors.black.withOpacity(0.1)),
                    ),
                  ),
                ),
              ),
            )
            .toList(),
      ),
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
            style: Theme.of(context).textTheme.headline6,
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
      BuildContext context,
      String projectId,
      List<LabelLab.Image> images,
      bool isSelecting,
      List<String> selectedImages) {
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
                          AnimatedCrossFade(
                            crossFadeState: selectedImages.contains(image.id)
                                ? CrossFadeState.showFirst
                                : CrossFadeState.showSecond,
                            duration: Duration(milliseconds: 200),
                            firstChild: Container(
                              decoration: BoxDecoration(
                                color: Theme.of(context)
                                    .accentColor
                                    .withOpacity(0.8),
                              ),
                              child: Center(
                                child: Icon(
                                  Icons.done,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                            secondChild: Container(),
                            layoutBuilder: (topChild, topChildKey, bottomChild,
                                bottomChildKey) {
                              return Stack(
                                overflow: Overflow.visible,
                                alignment: Alignment.center,
                                children: <Widget>[
                                  Positioned(
                                    key: bottomChildKey,
                                    child: bottomChild,
                                  ),
                                  Positioned(
                                    key: topChildKey,
                                    child: topChild,
                                  ),
                                ],
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  onTap: () => isSelecting
                      ? _selectImage(context, image.id)
                      : _gotoViewImage(context, projectId, image.id),
                  onLongPress: () => !isSelecting
                      ? _switchToMultiSelect(context, image.id)
                      : null,
                );
              }).toList(),
            ),
          )
        : SliverPadding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildEmptyPlaceholder(context, "No images yet"),
              ]),
            ),
          );
  }

  Widget _buildGroupsHeading(BuildContext context) {
    return SliverPadding(
      padding: EdgeInsets.only(top: 8, left: 16, right: 16),
      sliver: SliverList(
        delegate: SliverChildListDelegate([
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(
                "Groups",
                style: Theme.of(context).textTheme.headline6,
              ),
              FlatButton.icon(
                icon: Icon(Icons.add),
                label: Text("Add"),
                onPressed: () => _showAddEditGroupsModel(context, null),
              ),
            ],
          ),
        ]),
      ),
    );
  }

  Widget _buildGroups(
      BuildContext context, String projectId, List<Group> groups) {
    return SliverPadding(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        sliver: SliverList(
          delegate: SliverChildListDelegate([
            groups.length > 0
                ? SliverGrid.count(
                    mainAxisSpacing: 8,
                    crossAxisSpacing: 8,
                    crossAxisCount: 2,
                    childAspectRatio: 2,
                    children: groups
                        .map((group) => InkWell(
                              child: GroupItem(group),
                              onTap: () =>
                                  _gotoViewGroup(context, projectId, group.id),
                            ))
                        .toList(),
                  )
                : _buildEmptyPlaceholder(context, "No Groups yet"),
          ]),
        ));
  }

  Widget _buildLabelsHeading(BuildContext context) {
    return SliverPadding(
      padding: EdgeInsets.only(top: 8, left: 16, right: 16),
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
                onPressed: () => _showAddEditLabelModel(context),
              ),
            ],
          ),
        ]),
      ),
    );
  }

  Widget _buildLabels(
      BuildContext context, List<LabelLab.Image> images, List<Label> labels) {
    return SliverPadding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      sliver: SliverList(
        delegate: SliverChildListDelegate([
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
                      onTap: () =>
                          _showAddEditLabelModel(context, label: label),
                    );
                  }).toList(),
                )
              : _buildEmptyPlaceholder(context, "No labels yet"),
        ]),
      ),
    );
  }

  Widget _buildModelsHeading(BuildContext context) {
    return SliverPadding(
      padding: EdgeInsets.only(top: 8, left: 16, right: 16),
      sliver: SliverList(
        delegate: SliverChildListDelegate([
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(
                "Models",
                style: Theme.of(context).textTheme.title,
              ),
              FlatButton.icon(
                icon: Icon(Icons.add),
                label: Text("Add"),
                onPressed: () => _showAddEditModelPrompt(context),
              ),
            ],
          ),
        ]),
      ),
    );
  }

  Widget _buildModels(
      BuildContext context, String projectId, List<MlModel> models) {
    return models.length > 0
        ? SliverPadding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            sliver: SliverList(
              delegate: SliverChildListDelegate(models.map((model) {
                return Container(
                  margin: EdgeInsets.symmetric(vertical: 8),
                  child: InkWell(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        height: 64,
                        color: Colors.black12,
                        child: Container(
                          margin: EdgeInsets.symmetric(horizontal: 16),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              Text(model.name),
                              Text(MlModelMapper.typeToString(model.type)),
                              Icon(_getIcon(model.source))
                            ],
                          ),
                        ),
                      ),
                    ),
                    onTap: () => _gotoViewModel(context, projectId, model.id),
                  ),
                );
              }).toList()),
            ))
        : SliverPadding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildEmptyPlaceholder(context, "No images yet"),
              ]),
            ),
          );
  }

  IconData _getIcon(ModelSource source) {
    switch (source) {
      case ModelSource.TRANSFER:
        return Icons.swap_vert;
      case ModelSource.UPLOAD:
        return Icons.file_upload;
      case ModelSource.CUSTOM:
        return Icons.image;
      default:
        return Icons.warning;
    }
  }

  Widget _buildMembers(BuildContext context, List<Member> members) {
    final User _currentUser = Provider.of<AuthState>(context).user;
    return SliverPadding(
      padding: EdgeInsets.only(bottom: 72),
      sliver: SliverList(
        delegate: SliverChildListDelegate(
          members.map((member) {
            return ListTile(
              title: Text(member.name),
              subtitle: Text(member.email),
              trailing: _currentUser.name != member.name
                  ? PopupMenuButton<int>(
                      onSelected: (value) {
                        if (value == 0) {
                          _showRemoveMemberConfirmation(context, member);
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

  Widget _buildEmptyPlaceholder(BuildContext context, String description) {
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

  List<PopupMenuEntry<int>> _buildImageActions(BuildContext context) {
    return [
      PopupMenuItem(
        value: 0,
        child: Text("Select all"),
      ),
      PopupMenuItem(
        value: 1,
        child: Text("Delete"),
      ),
      PopupMenuItem(
        value: 2,
        child: Text("Cancel"),
      ),
    ];
  }

  void _onImageAction(BuildContext context, int index) {
    switch (index) {
      case 0:
        Provider.of<ProjectDetailBloc>(context).selectAllImages();
        break;
      case 1:
        Provider.of<ProjectDetailBloc>(context).deleteSelected();
        break;
      case 2:
        Provider.of<ProjectDetailBloc>(context).cancelSelection();
        break;
    }
  }

  void _switchToMultiSelect(BuildContext context, String id) {
    Provider.of<ProjectDetailBloc>(context).selectImage(id);
  }

  void _selectImage(BuildContext context, String id) {
    Provider.of<ProjectDetailBloc>(context).switchSelection(id);
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

  void _gotoViewGroup(BuildContext context, String projectId, String groupId) {
    Application.router
        .navigateTo(context, "/project/$projectId/group/$groupId")
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context).refresh();
    });
  }

  void _gotoViewModel(BuildContext context, String projectId, String id) {
    Application.router
        .navigateTo(context, "/train/$projectId")
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

  void _showRemoveMemberConfirmation(BuildContext baseContext, Member member) {
    showDialog<bool>(
        context: baseContext,
        builder: (context) {
          return DeleteConfirmDialog(
            name: member.name,
            onCancel: () => Navigator.pop(context),
            onConfirm: () {
              Provider.of<ProjectDetailBloc>(baseContext)
                  .removeUser(member.email);
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
              Provider.of<ProjectDetailBloc>(baseContext).deleteLabel(label.id);
              Navigator.of(context).pop(true);
            },
          );
        });
  }

  void _showAddEditLabelModel(BuildContext baseContext,
      {String projectId, Label label}) {
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

  void _showAddEditGroupsModel(BuildContext baseContext, Group group) {
    showDialog<bool>(
      context: baseContext,
      builder: (context) {
        return AddEditGroupDialog(
          Provider.of<ProjectDetailBloc>(baseContext).projectId,
          group: group,
        );
      },
    ).then((bool isSuccess) {
      if (isSuccess) {
        Provider.of<ProjectDetailBloc>(baseContext).refresh();
      }
    });
  }

  void _showAddEditModelPrompt(BuildContext baseContext, {MlModel model}) {
    showDialog<bool>(
      context: baseContext,
      builder: (context) {
        return AddEditModelDialog(
          Provider.of<ProjectDetailBloc>(baseContext).projectId,
          model: model,
        );
      },
    ).then((bool isSuccess) {
      if (isSuccess) {
        Provider.of<ProjectDetailBloc>(baseContext).refresh();
      }
    });
  }
}
