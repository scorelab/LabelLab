import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/data/api.dart';
import 'package:mobile/widgets/loading_progress.dart';

class HomeScreen extends StatefulWidget {
  @override
  HomeScreenState createState() => HomeScreenState();
}

class HomeScreenState extends State<HomeScreen> {
  File _image;
  String _result = '';
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('LabelLab'),
      ),
      body: ListView(
        children: <Widget>[
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              SizedBox(
                height: 16,
              ),
              _image != null
                  ? Image(
                      image: FileImage(_image),
                      width: 240,
                      height: 240,
                    )
                  : Container(
                      width: 240,
                      height: 240,
                    ),
              SizedBox(
                height: 16,
              ),
              _image == null
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: <Widget>[
                        FlatButton.icon(
                          icon: Icon(Icons.camera_alt),
                          label: Text("Camera"),
                          onPressed: () => _showImagePicker(ImageSource.camera),
                        ),
                        FlatButton.icon(
                          icon: Icon(Icons.photo_library),
                          label: Text("Gallery"),
                          onPressed: () =>
                              _showImagePicker(ImageSource.gallery),
                        ),
                      ],
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        FlatButton.icon(
                          icon: Icon(Icons.delete_outline),
                          label: Text("Remove"),
                          onPressed: _resetImage,
                        ),
                      ],
                    ),
              SizedBox(
                height: 16,
              ),
              RaisedButton(
                child:
                    !_loading ? Text("Classify") : LoadingProgress(color: Colors.black),
                color: Theme.of(context).accentColor,
                onPressed: _image != null ? _uploadImage : null,
              ),
              SizedBox(height: 16),
              Text(_result != null ? _result : "NaN"),
            ],
          ),
        ],
      ),
    );
  }

  void _showImagePicker(ImageSource source) async {
    var image = await ImagePicker.pickImage(source: source);

    setState(() {
      _image = image;
    });
  }

  void _uploadImage() {
    setState(() {
      _loading = true;
    });
    API().uploadImage(_image).then((res) {
      setState(() {
        _result = res.toString();
      });
    }).catchError((err) {
      setState(() {
        _result = err.toString();
      });
      print(err.toString());
    }).whenComplete(() {
      setState(() {
        _loading = false;
      });
    });
  }

  void _resetImage() {
    setState(() {
      _image = null;
    });
  }
}
