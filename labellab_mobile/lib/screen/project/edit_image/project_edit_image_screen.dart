import 'dart:io';

import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/project/edit_image/project_edit_image_bloc.dart';
import 'package:labellab_mobile/screen/project/edit_image/project_edit_image_state.dart';
import 'package:labellab_mobile/widgets/label_icon_button.dart';
import 'package:image_cropper/image_cropper.dart';
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
            leading: _buildBackButton(context, snapshot),
          ),
          body: _buildBody(context, snapshot),
        );
      },
    );
  }

  Widget _buildBackButton(
      BuildContext context, AsyncSnapshot<ProjectEditImageState> snapshot) {
    return IconButton(
      icon: Icon(Platform.isAndroid ? Icons.arrow_back : Icons.arrow_back_ios),
      onPressed: () => Navigator.pop(context, snapshot.data.image),
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
                  LabelIconButton(Icons.crop, "Crop", onTap: () {
                    _showImageCrop(context, _state.image);
                  }),
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

  void _showImageCrop(BuildContext context, File image) async {
    File croppedFile = await ImageCropper.cropImage(
        sourcePath: image.path,
        aspectRatioPresets: Platform.isAndroid
            ? [
                CropAspectRatioPreset.square,
                CropAspectRatioPreset.ratio3x2,
                CropAspectRatioPreset.original,
                CropAspectRatioPreset.ratio4x3,
                CropAspectRatioPreset.ratio16x9
              ]
            : [
                CropAspectRatioPreset.original,
                CropAspectRatioPreset.square,
                CropAspectRatioPreset.ratio3x2,
                CropAspectRatioPreset.ratio4x3,
                CropAspectRatioPreset.ratio5x3,
                CropAspectRatioPreset.ratio5x4,
                CropAspectRatioPreset.ratio7x5,
                CropAspectRatioPreset.ratio16x9
              ],
        androidUiSettings: AndroidUiSettings(
            toolbarTitle: 'Crop Image',
            toolbarColor: Theme.of(context).accentColor,
            toolbarWidgetColor: Colors.white,
            initAspectRatio: CropAspectRatioPreset.original,
            lockAspectRatio: false),
        iosUiSettings: IOSUiSettings(
          title: 'Crop Image',
        ));
    if (croppedFile != null) {
      Provider.of<ProjectEditImageBloc>(context).cropImage(croppedFile);
    }
  }

  void _showImageResize() {}
}
