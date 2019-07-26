import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:labellab_mobile/model/image.dart' as LabelLab;
import 'package:labellab_mobile/screen/project/view_image/project_view_image_bloc.dart';
import 'package:labellab_mobile/screen/project/view_image/project_view_image_state.dart';
import 'package:provider/provider.dart';

class ProjectViewImageScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
        stream: Provider.of<ProjectViewImageBloc>(context).state,
        initialData: ProjectViewImageState.loading(),
        builder: (context, AsyncSnapshot<ProjectViewImageState> snapshot) {
          return Scaffold(
            appBar: AppBar(
              title: Text(""),
              elevation: 0,
            ),
            body: _buildBody(context, snapshot),
          );
        });
  }

  Widget _buildBody(
      BuildContext context, AsyncSnapshot<ProjectViewImageState> snapshot) {
    if (snapshot.hasData) {
      ProjectViewImageState _state = snapshot.data;
      return Column(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          _state.isLoading ? LinearProgressIndicator() : Container(),
          _state.error != null ? Text(_state.error) : Container(),
          _state.image != null
              ? Image(
                  image: CachedNetworkImageProvider(_state.image.imageUrl),
                  fit: BoxFit.fitWidth,
                )
              : Container(),
        ],
      );
    } else {
      return Container();
    }
  }
}
