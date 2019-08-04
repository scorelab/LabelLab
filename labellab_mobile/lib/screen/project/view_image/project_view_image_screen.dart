import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/view_image/project_view_image_bloc.dart';
import 'package:labellab_mobile/screen/project/view_image/project_view_image_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
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
            actions: _buildActions(context),
          ),
          body: _buildBody(context, snapshot),
          floatingActionButton: FloatingActionButton(
            child: Icon(Icons.label),
            onPressed: () =>
                _gotoLabelImageScreen(context, snapshot.data.image.id),
          ),
        );
      },
    );
  }

  List<Widget> _buildActions(BuildContext context) {
    return [
      PopupMenuButton<int>(
        onSelected: (int value) {
          if (value == 0) {
            _showDeleteConfirmation(context);
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
    ];
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

  void _gotoLabelImageScreen(BuildContext context, String imageId) {
    final String projectId =
        Provider.of<ProjectViewImageBloc>(context).projectId;
    Application.router
        .navigateTo(context, "/project/$projectId/label/:imageId")
        .whenComplete(() {
      Provider.of<ProjectViewImageBloc>(context).fetchImage();
    });
  }

  void _showDeleteConfirmation(BuildContext baseContext) {
    showDialog<bool>(
        context: baseContext,
        builder: (context) {
          return DeleteConfirmDialog(
            name: "image",
            onCancel: () => Navigator.pop(context),
            onConfirm: () {
              Provider.of<ProjectViewImageBloc>(baseContext).delete();
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
