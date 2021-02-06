import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/view_group/project_view_group_bloc.dart';
import 'package:labellab_mobile/screen/project/view_group/project_view_group_state.dart';
import 'package:provider/provider.dart';
import 'package:labellab_mobile/model/image.dart' as Labellab;

class ProjectViewGroupScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: Provider.of<ProjectViewGroupBloc>(context).state,
      initialData: ProjectViewGroupState.loading(),
      builder: (BuildContext context,
          AsyncSnapshot<ProjectViewGroupState> snapshot) {
        if (snapshot.hasData) {
          ProjectViewGroupState _state = snapshot.data;
          return Scaffold(
            appBar: AppBar(
              title: Text(_state.isLoading ? "" : _state.group.name),
              elevation: 0,
              actions: _buildActions(
                  context, _state.group != null ? _state.group.id : null),
            ),
            body: _state.isLoading
                ? LinearProgressIndicator(
                    backgroundColor: Theme.of(context).canvasColor,
                  )
                : Container(
                    margin: EdgeInsets.symmetric(horizontal: 16),
                    child: _state.group.images != null
                        ? GridView.count(
                            mainAxisSpacing: 8,
                            crossAxisSpacing: 8,
                            crossAxisCount: 4,
                            children: _state.group.images.map((image) {
                              return InkWell(
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: Container(
                                    width: 64,
                                    height: 64,
                                    color: Colors.black12,
                                    child: Image(
                                      image: CachedNetworkImageProvider(
                                        image.imageUrl,
                                      ),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                onTap: () => _gotoViewImage(
                                    context, _state.group.projectId, image.id),
                              );
                            }).toList(),
                          )
                        : Center(
                            child: Text("No images so far"),
                          ),
                  ),
            floatingActionButton: _buildFloatingActionButton(
                context,
                Provider.of<ProjectViewGroupBloc>(context).projectId,
                Provider.of<ProjectViewGroupBloc>(context).groupId),
          );
        } else {
          return Container();
        }
      },
    );
  }

  List<Widget> _buildActions(BuildContext context, String groupId) {
    return [
      PopupMenuButton<int>(
        onSelected: (int value) {
          _gotoTrainGroup(context, groupId);
        },
        itemBuilder: (context) {
          return [
            PopupMenuItem(
              value: 0,
              child: Text("Train"),
            )
          ];
        },
      )
    ];
  }

  Widget _buildFloatingActionButton(
      BuildContext context, String projectId, String groupId) {
    return FloatingActionButton(
      child: Icon(
        Icons.add,
        color: Colors.white,
      ),
      onPressed: () => _gotoAddMoreImages(context, projectId, groupId),
    );
  }

  void _gotoViewImage(BuildContext context, String projectId, String imageId) {
    Application.router
        .navigateTo(context, "/project/$projectId/view/$imageId")
        .whenComplete(() {
      Provider.of<ProjectViewGroupBloc>(context).refresh();
    });
  }

  void _gotoTrainGroup(BuildContext context, String groupId) {
    Application.router.navigateTo(context, '/train/$groupId');
  }

  void _gotoAddMoreImages(
      BuildContext context, String projectId, String groupId) {
    Application.router
        .navigateTo(context, "/project/$projectId/group/$groupId/add")
        .whenComplete(() {
      Provider.of<ProjectViewGroupBloc>(context).refresh();
    });
  }
}
