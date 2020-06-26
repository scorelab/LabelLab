import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/project/view_group/project_view_group_bloc.dart';
import 'package:labellab_mobile/screen/project/view_group/project_view_group_state.dart';
import 'package:provider/provider.dart';
import 'package:labellab_mobile/model/image.dart' as Labellab;

class ProjectViewGroupScreen extends StatelessWidget {
  List<Labellab.Image> images;

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
              // title: Text(_state.group.name),
              title: Text("Test Group 1"),
              elevation: 0,
              actions: _buildActions(context),
            ),
            body: Container(
              margin: EdgeInsets.symmetric(horizontal: 16),
              child: images != null
                  ? GridView.count(
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
                              child: Image(
                                image: CachedNetworkImageProvider(
                                  image.imageUrl,
                                ),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    )
                  : Center(
                      child: Text("No images so far"),
                    ),
            ),
            floatingActionButton: _buildFloatingActionButton(),
          );
        } else {
          return Container();
        }
      },
    );
  }

  List<Widget> _buildActions(BuildContext context) {
    return [
      PopupMenuButton<int>(
        onSelected: (int value) {
          _gotoTrainGroup();
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

  Widget _buildFloatingActionButton() {
    return FloatingActionButton(
      child: Icon(
        Icons.add,
        color: Colors.white,
      ),
      onPressed: _showAddMoreImagesModel,
    );
  }

  void _gotoTrainGroup() {}

  void _showAddMoreImagesModel() {}
}
