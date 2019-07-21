import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:labellab_mobile/model/upload_image.dart';
import 'package:labellab_mobile/screen/project/upload_image/project_upload_image_bloc.dart';
import 'package:labellab_mobile/screen/project/upload_image/project_upload_image_state.dart';
import 'package:provider/provider.dart';

class ProjectUploadImageScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
        stream: Provider.of<ProjectUploadImageBloc>(context).state,
        initialData: ProjectUploadImageState.initial(),
        builder: (context, AsyncSnapshot<ProjectUploadImageState> snapshot) {
          return Scaffold(
            appBar: AppBar(
              title: Text("Upload Image"),
            ),
            body: _buildBody(context, snapshot),
            floatingActionButton: snapshot.data.images.length > 0
                ? FloatingActionButton(
                    child: Icon(Icons.done),
                    onPressed: () {
                      Provider.of<ProjectUploadImageBloc>(context)
                          .uploadImages();
                    },
                  )
                : null,
          );
        });
  }

  Widget _buildBody(
      BuildContext context, AsyncSnapshot<ProjectUploadImageState> snapshot) {
    if (snapshot.hasData) {
      ProjectUploadImageState _state = snapshot.data;
      List<Widget> _imageList = _state.images.map((image) {
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
    return InkWell(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Stack(
            fit: StackFit.expand,
            children: <Widget>[
              Image(
                fit: BoxFit.cover,
                image: FileImage(image.image),
              ),
              image.state == UploadImageState.PENDING
                  ? Positioned(
                      right: 8,
                      top: 8,
                      child: GestureDetector(
                        child: Icon(
                          Icons.cancel,
                          size: 28,
                          color: Colors.black54,
                        ),
                        onTap: () {
                          Provider.of<ProjectUploadImageBloc>(context)
                              .unselectImage(image);
                        },
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
      ),
      onTap: () => _showChangePictureMethodSelect(context),
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
      onTap: () => _showChangePictureMethodSelect(context),
    );
  }

  void _showChangePictureMethodSelect(BuildContext pageContext) {
    showDialog(
        context: pageContext,
        builder: (context) => AlertDialog(
              title: Text("Choose method"),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  ListTile(
                    leading: Icon(Icons.camera),
                    title: Text("Camera"),
                    onTap: () => _showImagePicker(context, ImageSource.camera),
                  ),
                  ListTile(
                    leading: Icon(Icons.photo_library),
                    title: Text("Gallery"),
                    onTap: () =>
                        _showImagePicker(pageContext, ImageSource.gallery),
                  ),
                ],
              ),
            ));
  }

  void _showImagePicker(BuildContext context, ImageSource source) {
    ImagePicker.pickImage(source: source).then((image) {
      if (image != null) {
        Provider.of<ProjectUploadImageBloc>(context).selectImage(image);
        Navigator.pop(context);
      }
    });
  }
}
