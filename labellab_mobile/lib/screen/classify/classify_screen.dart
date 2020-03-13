import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:image_picker/image_picker.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/classify/classify_bloc.dart';
import 'package:labellab_mobile/screen/classify/classify_state.dart';
import 'package:labellab_mobile/widgets/selected_image.dart';
import 'package:path_provider/path_provider.dart';
import 'package:provider/provider.dart';

class ClassifyScreen extends StatefulWidget {
  final bool isCamera;

  ClassifyScreen(this.isCamera);

  @override
  _ClassifyScreenState createState() => _ClassifyScreenState();
}

class _ClassifyScreenState extends State<ClassifyScreen> {
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
          "Classifing",
        ),
        centerTitle: true,
        elevation: 0,
      ),
      body: StreamBuilder<ClassifyState>(
          stream: Provider.of<ClassifyBloc>(context).state,
          initialData: ClassifyState.initial(),
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              ClassifyState state = snapshot.data;
              if (state.classification != null) {
                WidgetsBinding.instance.addPostFrameCallback(
                        (_) =>
                        _gotoClassificationDetail(state.classification.id));
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
                  state.isClassifing
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
                  state.isClassifing
                      ? Container()
                      : FlatButton(
                    child: Text("Upload"),
                    onPressed: () async {
                      Provider.of<ClassifyBloc>(context).classifyImage(
                          uploadWithCompression
                              ? await _compressImage(state.image)
                              : state.image);
                    },
                  ),
                  SizedBox(
                    height: 24,
                  ),
                  state.isClassifing
                      ? Container()
                      : FlatButton(
                    child: Text("Cancel"),
                    onPressed: () {
                      Application.router.pop(context);
                    },
                  ),
                  state.isClassifing ? _buildProgress(context) : Container(),
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
            Provider.of<ClassifyBloc>(context).retry();
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
              Provider.of<ClassifyBloc>(context).cancel();
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
        Provider.of<ClassifyBloc>(context).setImage(image);
      } else {
        Application.router.pop(context);
      }
    }).catchError((err) => print(err));
  }

  void _gotoClassificationDetail(String id) {
    Application.router
        .navigateTo(context, "/classification/$id", replace: true);
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
