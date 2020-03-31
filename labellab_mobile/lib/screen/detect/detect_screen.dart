import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:image_picker/image_picker.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/detect/detect_state.dart';
import 'package:labellab_mobile/widgets/selected_image.dart';
import 'package:path_provider/path_provider.dart';
import 'package:provider/provider.dart';

import 'detect_bloc.dart';

class DetectScreen extends StatefulWidget {
  final bool isCamera;

  DetectScreen(this.isCamera);

  @override
  _DetectScreenState createState() => _DetectScreenState();
}

class _DetectScreenState extends State<DetectScreen> {
  bool uploadWithCompression;

  @override
  void initState() {
    super.initState();
    uploadWithCompression = true;
    _showImagePicker(
        context, widget.isCamera ? ImageSource.camera : ImageSource.gallery);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(
          "Object Detection",
        ),
        centerTitle: true,
        elevation: 0,
      ),
      body: StreamBuilder<DetectState>(
          stream: Provider.of<DetectBloc>(context).state,
          initialData: DetectState.initial(),
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              DetectState state = snapshot.data;
              if (state.objectDetection != null) {
                WidgetsBinding.instance.addPostFrameCallback(
                        (_) =>
                        _gotoClassificationDetail(state.objectDetection.id));
              }
              return ListView(
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: SelectedImage(
                            image: state.image,
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  state.isDetecting
                      ? Container()
                      : CheckboxListTile(
                    title: Text("Upload Compressed Image (Faster)"),
                    value: uploadWithCompression,
                    onChanged: (newValue) {
                      setState(() {
                        uploadWithCompression = newValue;
                      });
                    },
                    controlAffinity: ListTileControlAffinity
                        .leading, //  <-- leading Checkbox
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  state.isDetecting
                      ? Container()
                      : FlatButton(
                    child: Text("Upload"),
                    onPressed: () async {
                      Provider.of<DetectBloc>(context).detectImage(
                          uploadWithCompression
                              ? await _compressImage(state.image)
                              : state.image);
                    },
                  ),
                  SizedBox(
                    height: 24,
                  ),
                  state.isDetecting
                      ? Container()
                      : FlatButton(
                    child: Text("Cancel"),
                    onPressed: () {
                      Application.router.pop(context);
                    },
                  ),
                  state.isDetecting ? _buildProgress(context) : Container(),
                  state.error != null
                      ? _buildError(context, state.error)
                      : Container(),
                ],
              );
            } else
              return Container();
          }),
    );
  }

  Widget _buildError(BuildContext context, dynamic error) {
    return Column(
      children: <Widget>[
        Text(error is DioError ? error.message.toString() : error.toString()),
        FlatButton(
          child: Text("Retry"),
          onPressed: () {
            Provider.of<DetectBloc>(context).retry();
          },
        ),
      ],
    );
  }

  Widget _buildProgress(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 24.0, horizontal: 24),
      child: Column(
        children: <Widget>[
          LinearProgressIndicator(),
          SizedBox(
            height: 24,
          ),
          FlatButton(
            child: Text("Cancel"),
            onPressed: () {
              Provider.of<DetectBloc>(context).cancel();
              Application.router.pop(context);
            },
          ),
        ],
      ),
    );
  }

  void _showImagePicker(BuildContext context, ImageSource source) {
    ImagePicker.pickImage(source: source).then((image) async {
      if (image != null) {
        Provider.of<DetectBloc>(context).setImage(image);
      } else {
        Application.router.pop(context);
      }
    }).catchError((err) => print(err));
  }

  void _gotoClassificationDetail(String id) {
    Application.router
        .navigateTo(context, "/objectDetection/$id", replace: true);
  }

  Future<File> _compressImage(File image) async {
    image = await FlutterImageCompress.compressAndGetFile(
        image.absolute.path,
        (await getApplicationDocumentsDirectory()).path +
            image.path
                ?.split("/")
                ?.last,
        quality: 70);
    return image;
  }
}
