import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/view_more_images/project_more_images_bloc.dart';
import 'package:labellab_mobile/screen/project/view_more_images/project_more_images_state.dart';
import 'package:provider/provider.dart';

class ProjectMoreImagesScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Images"),
        elevation: 0,
      ),
      body: StreamBuilder<ProjectMoreImagesState>(
        stream: Provider.of<ProjectMoreImagesBloc>(context).state,
        initialData: ProjectMoreImagesState.loading(),
        builder: (context, snapshot) {
          final ProjectMoreImagesState _state = snapshot.data;
          return _state.images != null
              ? GridView.count(
                  mainAxisSpacing: 2,
                  crossAxisCount: 3,
                  crossAxisSpacing: 2,
                  children: _state.images.map((image) {
                    return InkWell(
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
                      onTap: () => _gotoViewImage(
                        context,
                        Provider.of<ProjectMoreImagesBloc>(context).projectId,
                        image.id,
                      ),
                    );
                  }).toList(),
                )
              : LinearProgressIndicator();
        },
      ),
    );
  }

  void _gotoViewImage(BuildContext context, String projectId, String imageId) {
    Application.router
        .navigateTo(context, "/project/$projectId/view/$imageId")
        .whenComplete(() {
      Provider.of<ProjectMoreImagesBloc>(context).refresh();
    });
  }
}
