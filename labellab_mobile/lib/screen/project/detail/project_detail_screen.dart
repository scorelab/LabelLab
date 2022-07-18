import 'dart:math';
import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/image.dart' as LabelLab;
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/member.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/team.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/issue/issue_activity/issue_activity_bloc.dart';
import 'package:labellab_mobile/screen/project/add_edit_label/add_edit_label_dialog.dart';
import 'package:labellab_mobile/screen/project/add_edit_model/add_edit_model_dialog.dart';
import 'package:labellab_mobile/screen/project/add_team_dialog/add_team_dialog.dart';
import 'package:labellab_mobile/widgets/issue_list_tile.dart';
import 'package:labellab_mobile/widgets/leave_project_confirm_dialog.dart';
import 'package:labellab_mobile/widgets/recent_activity_list_tile.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_bloc.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_state.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:labellab_mobile/widgets/team_item.dart';
import 'package:provider/provider.dart';

class ProjectDetailScreen extends StatelessWidget {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<ProjectDetailState>(
      stream: Provider.of<ProjectDetailBloc>(context).state,
      initialData: ProjectDetailState.loading(),
      builder: (context, snapshot) {
        ProjectDetailState _state = snapshot.data!;
        bool _hasImages = (_state.project != null)
            ? _state.project!.images!.length > 0
            : false;
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
                    _state.project != null ? _state.project!.name! : "",
                    style: TextStyle(color: Colors.white),
                    textAlign: TextAlign.center,
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
                        _state.project!.description != null
                            ? _buildInfo(context, _state.project!.description!)
                            : Container(),
                        _buildRecentActivity(context, _state.project!),
                        _state.project != null && _state.project!.issues != null
                            ? _buildIssue(context, _state.project!)
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
                                    _state.project!.images!.length > 8
                                        ? TextButton(
                                            child: Text("More"),
                                            onPressed: () =>
                                                _gotoMoreImagesScreen(
                                              context,
                                              _state.project!.id,
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
              _state.project != null && _state.project!.images != null
                  ? _buildImages(
                      context,
                      _state.project!.id,
                      _state.project!.images!,
                      _state.isSelecting,
                      _state.selectedImages)
                  : SliverFillRemaining(),
              _state.project != null
                  ? _buildTeamsHeading(context, _state.project!)
                  : SliverFillRemaining(),
              _state.project != null && _state.project!.teams != null
                  ? _buildTeams(
                      context, _state.project!.id, _state.project!.teams!)
                  : SliverFillRemaining(),
              _state.project != null
                  ? _buildLabelsHeading(context)
                  : SliverFillRemaining(),
              _state.project != null && _state.project!.labels != null
                  ? _buildLabels(
                      context, _state.project!.images, _state.project!.labels!)
                  : SliverFillRemaining(),
              _state.project != null
                  ? _buildModelsHeading(context)
                  : SliverFillRemaining(),
              _state.project != null && _state.project!.models != null
                  ? _buildModels(
                      context, _state.project!.id, _state.project!.models!)
                  : SliverFillRemaining(),
              _buildMembersHeading(context, _state.project),
              _state.project != null && _state.project!.members != null
                  ? _buildMembers(context, _state.project!.members!)
                  : SliverFillRemaining(),
            ],
          ),
          floatingActionButton:
              Provider.of<ProjectDetailBloc>(context, listen: false)
                      .hasImagesAccess()
                  ? FloatingActionButton(
                      child: Icon(
                        Icons.file_upload,
                        color: Colors.white,
                      ),
                      onPressed: () => _state.project != null
                          ? _gotoUploadImage(context, _state.project!.id)
                          : null,
                    )
                  : Container(),
        );
      },
    );
  }

  Widget _buildCover(ProjectDetailState state) {
    return Container(
      child: Row(
        children: state.project!.images!
            .sublist(0, min(state.project!.images!.length, 4))
            .map(
              (image) => Expanded(
                child: Container(
                  decoration: BoxDecoration(
                      image: DecorationImage(
                          image: CachedNetworkImageProvider(image.imageUrl!),
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

  List<Widget> _buildActions(BuildContext context, Project? project) {
    if (project == null) return [];
    if (!Provider.of<ProjectDetailBloc>(context, listen: false)
        .hasAdminAccess())
      return [
        PopupMenuButton<int>(
          onSelected: (int value) {
            if (value == 0) {
              _showLeaveProjectConfirmation(context, project);
            }
          },
          itemBuilder: (context) {
            return [
              PopupMenuItem(
                value: 0,
                child: Text("Leave"),
              ),
            ];
          },
        )
      ];
    return [
      PopupMenuButton<int>(
        onSelected: (int value) {
          if (value == 0) {
            _gotoEditProject(context, project.id!);
          } else if (value == 1) {
            _showProjectDeleteConfirmation(context, project);
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

  Widget _buildRecentActivity(BuildContext context, Project project) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(
                'Recent Activity',
                style: Theme.of(context).textTheme.headline6,
              ),
              TextButton.icon(
                icon: Icon(Icons.more_horiz_rounded),
                label: Text("More"),
                onPressed: () => _goToProjectActivityLogs(context, project.id!),
              ),
            ],
          ),
          (project.logs != null && project.logs!.isNotEmpty)
              ? Container(
                  height: min(170, project.logs!.length * 57),
                  child: ListView(
                    padding: const EdgeInsets.all(0),
                    children: [
                      for (var log in project.logs!) RecentActivityListTile(log)
                    ],
                  ),
                )
              : _buildEmptyPlaceholder(context, "No activity yet"),
        ],
      ),
    );
  }

  Widget _buildIssue(BuildContext context, Project project) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(
                'Recent Issues',
                style: Theme.of(context).textTheme.headline6,
              ),
              TextButton.icon(
                icon: Icon(Icons.more_horiz_rounded),
                label: Text("More"),
                onPressed: () => _goToIssues(context, project),
              ),
            ],
          ),
          (project.issues != null && project.issues!.isNotEmpty)
              ? Container(
                  height: min(200, project.issues!.length * 57),
                  child: ListView(
                    padding: const EdgeInsets.all(0),
                    children: [
                      for (var issue in project.issues!) IssueListTile(issue)
                    ],
                  ),
                )
              : _buildEmptyPlaceholder(context, "No Issues yet"),
        ],
      ),
    );
  }

  Widget _buildImages(
      BuildContext context,
      String? projectId,
      List<LabelLab.Image> images,
      bool isSelecting,
      List<String?>? selectedImages) {
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
                              image.imageUrl!,
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
                                  ? image.labels!.length != 1
                                      ? image.labels!.length.toString() +
                                          " Labels"
                                      : "1 Label"
                                  : "",
                              style:
                                  TextStyle(color: Colors.white, fontSize: 14),
                            ),
                          ),
                          AnimatedCrossFade(
                            crossFadeState: selectedImages!.contains(image.id)
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
                                clipBehavior: Clip.none,
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

  Widget _buildTeamsHeading(BuildContext context, Project project) {
    return SliverPadding(
      padding: EdgeInsets.only(top: 8, left: 16, right: 16),
      sliver: SliverList(
        delegate: SliverChildListDelegate([
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(
                "Teams",
                style: Theme.of(context).textTheme.headline6,
              ),
              Provider.of<ProjectDetailBloc>(context, listen: false)
                      .hasAdminAccess()
                  ? TextButton.icon(
                      icon: Icon(Icons.add),
                      label: Text("Add"),
                      onPressed: () => _showAddTeamDialog(context, project),
                    )
                  : Container(),
            ],
          ),
        ]),
      ),
    );
  }

  Widget _buildTeams(
      BuildContext context, String? projectId, List<Team> teams) {
    return SliverPadding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      sliver: SliverList(
        delegate: SliverChildListDelegate([
          teams.length > 0
              ? Wrap(
                  spacing: 8,
                  children: teams.map((team) {
                    return TeamItem(team, _gotoViewTeam);
                  }).toList(),
                )
              : _buildEmptyPlaceholder(context, "No Teams yet"),
        ]),
      ),
    );
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
                style: Theme.of(context).textTheme.headline6,
              ),
              Provider.of<ProjectDetailBloc>(context, listen: false)
                      .hasLabelsAccess()
                  ? TextButton.icon(
                      icon: Icon(Icons.add),
                      label: Text("Add"),
                      onPressed: () => _showAddEditLabelModel(context),
                    )
                  : Container(),
            ],
          ),
        ]),
      ),
    );
  }

  Widget _buildLabels(
      BuildContext context, List<LabelLab.Image>? images, List<Label> labels) {
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
                        label: Text(label.name!),
                        deleteIcon: Icon(Icons.cancel),
                        onDeleted: Provider.of<ProjectDetailBloc>(context,
                                    listen: false)
                                .hasLabelsAccess()
                            ? () => _showLabelDeleteConfirmation(context, label)
                            : null,
                      ),
                      onLongPress:
                          Provider.of<ProjectDetailBloc>(context, listen: false)
                                  .hasLabelsAccess()
                              ? () =>
                                  _showAddEditLabelModel(context, label: label)
                              : null,
                      onTap: () => _goToLabelLogs(context, label.id!),
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
                style: Theme.of(context).textTheme.headline6,
              ),
              Provider.of<ProjectDetailBloc>(context, listen: false)
                      .hasModelsAccess()
                  ? TextButton.icon(
                      icon: Icon(Icons.add),
                      label: Text("Add"),
                      onPressed: () => _showAddEditModelPrompt(context),
                    )
                  : Container(),
            ],
          ),
        ]),
      ),
    );
  }

  Widget _buildModels(
      BuildContext context, String? projectId, List<MlModel> models) {
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
                              Text(model.name!),
                              Row(
                                children: [
                                  Icon(_getIcon(model.source)),
                                  Provider.of<ProjectDetailBloc>(context,
                                              listen: false)
                                          .hasModelsAccess()
                                      ? IconButton(
                                          icon: Icon(Icons.edit),
                                          onPressed: () =>
                                              _showAddEditModelPrompt(
                                            context,
                                            model: model,
                                          ),
                                        )
                                      : Container(),
                                ],
                              ),
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
                _buildEmptyPlaceholder(context, "No models yet"),
              ]),
            ),
          );
  }

  Widget _buildMembersHeading(BuildContext context, Project? project) {
    return SliverPadding(
      padding: EdgeInsets.only(top: 8, left: 16, right: 16),
      sliver: SliverList(
        delegate: SliverChildListDelegate([
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(
                "Members",
                style: Theme.of(context).textTheme.headline6,
              ),
              Provider.of<ProjectDetailBloc>(context, listen: false)
                      .hasAdminAccess()
                  ? TextButton.icon(
                      icon: Icon(Icons.add),
                      label: Text("Add"),
                      onPressed: () => _gotoAddMemberScreen(context, project!),
                    )
                  : Container(),
            ],
          ),
        ]),
      ),
    );
  }

  IconData _getIcon(ModelSource? source) {
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
    final User? _currentUser =
        Provider.of<AuthState>(context, listen: false).user;
    return SliverPadding(
      padding: EdgeInsets.only(bottom: 72),
      sliver: SliverList(
        delegate: SliverChildListDelegate(
          members.map((member) {
            return ListTile(
              title: Text(member.name!),
              subtitle: Text(member.email!),
              trailing: (Provider.of<ProjectDetailBloc>(context, listen: false)
                          .hasAdminAccess() &&
                      _currentUser!.email != member.email)
                  ? PopupMenuButton<int>(
                      onSelected: (value) {
                        if (value == 0) {
                          _showRemoveMemberConfirmation(context, member);
                        } else if (value == 1) {
                          _showMakeAdminConfirmation(context, member);
                        } else if (value == 2) {
                          _showRemoveAdminConfirmation(context, member);
                        }
                      },
                      itemBuilder: (context) {
                        return [
                          PopupMenuItem(
                            value: 0,
                            child: Text("Remove"),
                          ),
                          !Provider.of<ProjectDetailBloc>(context,
                                      listen: false)
                                  .isUserAdmin(member.id!)
                              ? PopupMenuItem(
                                  value: 1,
                                  child: Text("Make Admin"),
                                )
                              : PopupMenuItem(
                                  value: 2,
                                  child: Text("Remove Admin"),
                                ),
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

  void _goToProjectActivityLogs(BuildContext context, String projectId) {
    Application.router
        .navigateTo(context, "/project/activity/" + projectId)
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context, listen: false).refresh();
    });
  }

  void _goToIssues(BuildContext context, Project project) {
    Application.router
        .navigateTo(context, "/project/issue/" + project.id!)
        .whenComplete(() {
      Provider.of<IssueActivityBloc>(context, listen: false).refresh();
    });
  }

  void _onImageAction(BuildContext context, int index) {
    switch (index) {
      case 0:
        Provider.of<ProjectDetailBloc>(context, listen: false)
            .selectAllImages();
        break;
      case 1:
        Provider.of<ProjectDetailBloc>(context, listen: false).deleteSelected();
        break;
      case 2:
        Provider.of<ProjectDetailBloc>(context, listen: false)
            .cancelSelection();
        break;
    }
  }

  void _switchToMultiSelect(BuildContext context, String? id) {
    Provider.of<ProjectDetailBloc>(context, listen: false).selectImage(id);
  }

  void _selectImage(BuildContext context, String? id) {
    Provider.of<ProjectDetailBloc>(context, listen: false).switchSelection(id);
  }

  void _gotoEditProject(BuildContext context, String id) {
    Application.router
        .navigateTo(context, "/project/edit/" + id)
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context, listen: false).refresh();
    });
  }

  void _gotoViewImage(
      BuildContext context, String? projectId, String? imageId) {
    Application.router
        .navigateTo(context, "/project/$projectId/view/$imageId")
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context, listen: false).refresh();
    });
  }

  void _gotoUploadImage(BuildContext context, String? id) {
    Application.router
        .navigateTo(context, "/project/$id/upload")
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context, listen: false).refresh();
    });
  }

  void _gotoAddMemberScreen(BuildContext context, Project project) {
    Application.router
        .navigateTo(context, "/project/${project.id}/add")
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context, listen: false).refresh();
    });
  }

  void _gotoMoreImagesScreen(BuildContext context, String? projectId) {
    Application.router
        .navigateTo(context, "/project/$projectId/images")
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context, listen: false).refresh();
    });
  }

  void _gotoViewTeam(BuildContext context, String? projectId, String? teamId) {
    Application.router
        .navigateTo(context, "/project/$projectId/team/$teamId")
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context, listen: false).refresh();
    });
  }

  void _gotoViewModel(
      BuildContext context, String? projectId, String? modelId) {
    Application.router
        .navigateTo(context, "/train/$projectId/$modelId")
        .whenComplete(() {
      Provider.of<ProjectDetailBloc>(context, listen: false).refresh();
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
              Provider.of<ProjectDetailBloc>(baseContext, listen: false)
                  .delete();
              Navigator.of(context).pop(true);
            },
          );
        }).then((success) {
      if (success != null && success) {
        Navigator.pop(baseContext);
      }
    });
  }

  void _showLeaveProjectConfirmation(
      BuildContext baseContext, Project project) {
    showDialog<bool>(
        context: baseContext,
        builder: (context) {
          return LeaveProjectConfirmDialog(
            name: project.name,
            onCancel: () => Navigator.pop(context),
            onConfirm: () {
              Provider.of<ProjectDetailBloc>(baseContext, listen: false)
                  .leave();
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
              Provider.of<ProjectDetailBloc>(baseContext, listen: false)
                  .removeUser(member.email);
              Navigator.of(context).pop(true);
            },
          );
        });
  }

  void _showMakeAdminConfirmation(BuildContext buildContext, Member member) {
    showDialog<bool>(
      context: buildContext,
      builder: (context) {
        return DeleteConfirmDialog(
          name: 'admin ${member.name}',
          positiveIntent: true,
          onCancel: () => Navigator.pop(context),
          onConfirm: () {
            Provider.of<ProjectDetailBloc>(buildContext, listen: false)
                .makeAdmin(member.email!);
            Navigator.of(context).pop(true);
          },
        );
      },
    );
  }

  void _showRemoveAdminConfirmation(BuildContext buildContext, Member member) {
    showDialog<bool>(
      context: buildContext,
      builder: (context) {
        return DeleteConfirmDialog(
          name: 'admin ${member.name}',
          onCancel: () => Navigator.pop(context),
          onConfirm: () {
            Provider.of<ProjectDetailBloc>(buildContext, listen: false)
                .removeAdmin(member.email!);
            Navigator.of(context).pop(true);
          },
        );
      },
    );
  }

  void _goToLabelLogs(BuildContext context, String labelId) {
    String projectId =
        Provider.of<ProjectDetailBloc>(context, listen: false).projectId;
    Application.router
        .navigateTo(context, "/project/activity/$projectId/label/$labelId");
  }

  void _showLabelDeleteConfirmation(BuildContext baseContext, Label label) {
    showDialog<bool>(
        context: baseContext,
        builder: (context) {
          return DeleteConfirmDialog(
            name: label.name,
            onCancel: () => Navigator.pop(context),
            onConfirm: () {
              Provider.of<ProjectDetailBloc>(baseContext, listen: false)
                  .deleteLabel(label.id);
              Navigator.of(context).pop(true);
            },
          );
        });
  }

  void _showAddEditLabelModel(BuildContext baseContext, {Label? label}) {
    showDialog<bool>(
      context: baseContext,
      builder: (context) {
        return AddEditLabelDialog(
          Provider.of<ProjectDetailBloc>(baseContext, listen: false).projectId,
          label: label,
        );
      },
    ).then((bool? isSuccess) {
      if (isSuccess!) {
        Provider.of<ProjectDetailBloc>(baseContext, listen: false).refresh();
      }
    });
  }

  void _showAddTeamDialog(BuildContext baseContext, Project project) {
    String projectId =
        Provider.of<ProjectDetailBloc>(baseContext, listen: false).projectId;
    List<String> memberEmails = project.members!.map((m) => m.email!).toList();
    showDialog<bool>(
      context: baseContext,
      builder: (context) {
        return AddTeamDialog(projectId, memberEmails: memberEmails);
      },
    ).then((bool? isSuccess) {
      if (isSuccess!) {
        Provider.of<ProjectDetailBloc>(baseContext, listen: false).refresh();
      }
    });
  }

  void _showAddEditModelPrompt(BuildContext baseContext, {MlModel? model}) {
    showDialog<bool>(
      context: baseContext,
      builder: (context) {
        return AddEditModelDialog(
          Provider.of<ProjectDetailBloc>(baseContext, listen: false).projectId,
          model: model,
        );
      },
    ).then((bool? isSuccess) {
      if (isSuccess!) {
        Provider.of<ProjectDetailBloc>(baseContext, listen: false).refresh();
      }
    });
  }
}
