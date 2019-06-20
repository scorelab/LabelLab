import 'dart:io';

import 'package:image_picker/image_picker.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/classify/classify_bloc.dart';
import 'package:labellab_mobile/screen/classify/classify_state.dart';
import 'package:labellab_mobile/widgets/selected_image.dart';
import 'package:provider/provider.dart';

class ClassifyScreen extends StatefulWidget {
  final bool isCamera;

  ClassifyScreen(this.isCamera);

  @override
  _ClassifyScreenState createState() => _ClassifyScreenState();
}

class _ClassifyScreenState extends State<ClassifyScreen> {
  @override
  void initState() {
    super.initState();
    _showImagePicker(
        context, widget.isCamera ? ImageSource.camera : ImageSource.gallery);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(
          "Classify",
        ),
        centerTitle: true,
        backgroundColor: Theme.of(context).canvasColor,
        elevation: 0,
      ),
      body: StreamBuilder<ClassifyState>(
          stream: Provider.of<ClassifyBloc>(context).state,
          initialData: ClassifyState.initial(),
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              ClassifyState state = snapshot.data;
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
                  state.isClassifing ? _buildProgress(context) : Container(),
                  state.error != null
                      ? _buildError(context, state.error)
                      : Container(),
                  state.classification != null
                      ? Text(state.classification.id)
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
        Text(error.toString()),
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
    ImagePicker.pickImage(source: source).then((image) {
      if (image != null) {
        Provider.of<ClassifyBloc>(context).classifyImage(image);
      } else {
        Application.router.pop(context);
      }
    }).catchError((err) => print(err));
  }
}
