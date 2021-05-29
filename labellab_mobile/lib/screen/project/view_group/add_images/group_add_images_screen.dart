import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/view_group/add_images/group_add_images_bloc.dart';
import 'package:labellab_mobile/screen/project/view_group/add_images/group_add_images_state.dart';
import 'package:provider/provider.dart';

class GroupAddImagesScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: Provider.of<GroupAddImagesBloc>(context).state,
      initialData: GroupAddImagesState.loading(),
      builder:
          (BuildContext context, AsyncSnapshot<GroupAddImagesState> snapshot) {
        if (snapshot.hasData) {
          GroupAddImagesState _state = snapshot.data!;
          return Scaffold(
            appBar: AppBar(
              title: Text("Add Images"),
              elevation: 0,
            ),
            body: _state.isLoading
                ? LinearProgressIndicator(
                    backgroundColor: Theme.of(context).canvasColor,
                  )
                : Container(
                    margin: EdgeInsets.symmetric(horizontal: 16),
                    child: _state.images != null
                        ? GridView.count(
                            mainAxisSpacing: 8,
                            crossAxisSpacing: 8,
                            crossAxisCount: 4,
                            children: _state.images!.map((image) {
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
                                          AnimatedCrossFade(
                                            crossFadeState: _state
                                                    .selectedImages!
                                                    .contains(image.id)
                                                ? CrossFadeState.showFirst
                                                : CrossFadeState.showSecond,
                                            duration:
                                                Duration(milliseconds: 200),
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
                                            layoutBuilder: (topChild,
                                                topChildKey,
                                                bottomChild,
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
                                  onTap: () => _selectImage(context, image.id));
                            }).toList(),
                          )
                        : Center(
                            child: Text("No images so far"),
                          ),
                  ),
            floatingActionButton: _state.selectedImages!.isNotEmpty
                ? FloatingActionButton(
                    child: Icon(Icons.done),
                    onPressed: () => _addImages(context),
                  )
                : null,
          );
        } else {
          return Container();
        }
      },
    );
  }

  void _selectImage(BuildContext context, String? id) {
    Provider.of<GroupAddImagesBloc>(context).switchSelection(id);
  }

  void _addImages(context) {
    Provider.of<GroupAddImagesBloc>(context).addImages();
    Application.router.pop(context);
  }
}
