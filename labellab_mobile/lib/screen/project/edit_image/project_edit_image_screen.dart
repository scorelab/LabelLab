import 'dart:io';

import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/project/edit_image/project_edit_image_bloc.dart';
import 'package:labellab_mobile/screen/project/edit_image/project_edit_image_state.dart';
import 'package:labellab_mobile/widgets/label_icon_button.dart';
import 'package:provider/provider.dart';

class ProjectEditImageScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: Provider.of<ProjectEditImageBloc>(context).state,
      initialData: ProjectEditImageState.loading(),
      builder: (BuildContext context,
          AsyncSnapshot<ProjectEditImageState> snapshot) {
        return Scaffold(
          appBar: AppBar(
            title: Text("Edit Image"),
            elevation: 0,
          ),
          body: _buildBody(context, snapshot),
        );
      },
    );
  }

  Widget _buildBody(
      BuildContext context, AsyncSnapshot<ProjectEditImageState> snapshot) {
    if (snapshot.hasData) {
      ProjectEditImageState _state = snapshot.data;

      return Column(
        mainAxisSize: MainAxisSize.max,
        children: <Widget>[
          _state.isLoading ? LinearProgressIndicator() : Container(),
          _state.error != null ? Text(_state.error) : Container(),
          _state.image != null
              ? Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                        image: _state.image != null
                            ? DecorationImage(image: FileImage(_state.image))
                            : null),
                  ),
                )
              : Container(),
          Card(
            color: Theme.of(context).bottomAppBarColor,
            child: Container(
              height: 64,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  LabelIconButton(
                    Icons.crop,
                    "Crop",
                    onTap: _showImageCrop,
                  ),
                  LabelIconButton(
                    Icons.photo_size_select_large,
                    "Resize",
                    onTap: _showImageResize,
                  ),
                ],
              ),
            ),
          )
        ],
      );
    } else {
      return Container();
    }
  }

  void _showImageCrop() {}

  void _showImageResize() {}
}
