import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:multi_image_picker/multi_image_picker.dart';
import 'package:labellab_mobile/model/upload_image.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/upload_image/project_upload_image_bloc.dart';
import 'package:labellab_mobile/screen/project/upload_image/project_upload_image_state.dart';
import 'package:logger/logger.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:rxdart/rxdart.dart';

class ProjectUploadImageScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
        stream: Provider.of<ProjectUploadImageBloc>(context).state,
        initialData: ProjectUploadImageState.initial(),
        builder: (context, AsyncSnapshot<ProjectUploadImageState> snapshot) {
          if (snapshot.data!.isSuccess) {
            WidgetsBinding.instance!
                .addPostFrameCallback((_) => Application.router.pop(context));
          }
          return Scaffold(
            appBar: AppBar(
              title: Text("Upload Image"),
              elevation: 0,
            ),
            body: _buildBody(context, snapshot),
            floatingActionButton: snapshot.data!.images!.length > 0
                ? FloatingActionButton(
                    child: Icon(Icons.done),
                    onPressed: !snapshot.data!.isLoading
                        ? () {
                            Provider.of<ProjectUploadImageBloc>(
                              context,
                              listen: false,
                            ).uploadImages();
                          }
                        : null,
                  )
                : null,
          );
        });
  }

  Widget _buildBody(
      BuildContext context, AsyncSnapshot<ProjectUploadImageState> snapshot) {
    if (snapshot.hasData) {
      ProjectUploadImageState _state = snapshot.data!;
      List<Widget> _imageList = _state.images!.map((image) {
        return _imageItem(context, image);
      }).toList();
      _imageList.add(_selectImageAction(context));
      return GridView.count(
        crossAxisCount: 3,
        padding: EdgeInsets.all(8),
        children: _state.images != null
            ? _imageList
            : [
                _selectImageAction(context),
              ],
      );
    } else {
      return Container();
    }
  }

  Widget _imageItem(BuildContext context, UploadImage image) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: Stack(
          fit: StackFit.expand,
          children: <Widget>[
            Image(
              fit: BoxFit.cover,
              image: FileImage(image.image!),
            ),
            image.state == UploadImageState.PENDING
                ? Positioned(
                    top: 8,
                    left: 8,
                    right: 8,
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        GestureDetector(
                          child: Icon(
                            Icons.edit,
                            size: 28,
                            color: Colors.black54,
                          ),
                          onTap: () {
                            _showImageEdit(context, image);
                          },
                        ),
                        GestureDetector(
                          child: Icon(
                            Icons.cancel,
                            size: 28,
                            color: Colors.black54,
                          ),
                          onTap: () {
                            Provider.of<ProjectUploadImageBloc>(
                              context,
                              listen: false,
                            ).unselectImage(image);
                          },
                        ),
                      ],
                    ),
                  )
                : Container(),
            image.state == UploadImageState.LOADING
                ? Positioned(
                    left: 48,
                    right: 48,
                    bottom: 48,
                    top: 48,
                    child: CircularProgressIndicator())
                : Container(),
            image.state == UploadImageState.SUCCESS
                ? Icon(
                    Icons.done,
                    color: Colors.greenAccent,
                    size: 32,
                  )
                : Container(),
          ],
        ),
      ),
    );
  }

  Widget _selectImageAction(BuildContext context) {
    return InkWell(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Container(color: Colors.black12, child: Icon(Icons.add)),
        ),
      ),
      onTap: () => _selectImages(context),
    );
  }

  void _selectImages(BuildContext context) async {
    if (await Permission.accessMediaLocation.request().isGranted) {
      List<UploadImage> uploadImages = [];

      MultiImagePicker.pickImages(
        maxImages: 100,
        enableCamera: true,
        materialOptions: MaterialOptions(
          actionBarTitle: "Select Images",
          actionBarColor: "#00a89f",
          statusBarColor: "#a2a2a2",
          useDetailsView: false,
        ),
      ).then((images) {
        // Emmits upload images
        Stream.fromIterable(images).flatMap((image) {
          // To create a temp image file
          Future<File> fetchImageFile = image.getByteData().then((byteData) {
            return getTemporaryDirectory().then((tempDir) {
              return new File(tempDir.path + '/' + image.name!).writeAsBytes(
                  byteData.buffer.asUint8List(
                      byteData.offsetInBytes, byteData.lengthInBytes));
            });
          });

          // To read image metadata
          Future<Metadata> fetchMetadata = image.metadata;

          return Future.wait([fetchImageFile, fetchMetadata]).then((result) {
            return UploadImage(
                name: image.name,
                image: result.first as File?,
                metadata: result.last as Metadata?);
          }).asStream();
        }).doOnDone(() {
          Provider.of<ProjectUploadImageBloc>(context, listen: false)
              .selectImages(uploadImages);
        }).listen((uploadImage) {
          uploadImages.add(uploadImage);
        });
      }).catchError((err) {
        Logger().e(err.toString());
      });
    } else {
      Logger().e("Permission denied");
    }
  }

  void _showImageEdit(BuildContext context, UploadImage image) async {
    final imageIndex =
        Provider.of<ProjectUploadImageBloc>(context, listen: false)
            .getImageIndex(image);

    File? editedFile = await ImageCropper().cropImage(
        sourcePath: image.image!.path,
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
          toolbarTitle: 'Edit Image',
          toolbarColor: Theme.of(context).accentColor,
          toolbarWidgetColor: Colors.white,
          initAspectRatio: CropAspectRatioPreset.original,
          lockAspectRatio: false,
        ),
        iosUiSettings: IOSUiSettings(
          title: 'Edit Image',
        ));
    if (editedFile != null) {
      Provider.of<ProjectUploadImageBloc>(context, listen: false)
          .updateImage(imageIndex, editedFile);
    }
  }
}
