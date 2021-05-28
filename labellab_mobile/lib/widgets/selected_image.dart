import 'dart:io';

import 'package:flutter/material.dart';

class SelectedImage extends StatelessWidget {
  final File? image;
  final double? height;

  SelectedImage({this.image, this.height});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: Container(
        color: Colors.grey,
        child: image != null
            ? Image(
                image: FileImage(image!),
                height: height != null ? height : 320,
                fit: BoxFit.cover,
              )
            : Container(
                height: height != null ? height : 320,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Icon(Icons.not_interested),
                    Text("No image selected")
                  ],
                ),
              ),
      ),
    );
  }
}
