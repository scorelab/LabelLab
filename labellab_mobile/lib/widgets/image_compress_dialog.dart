import 'package:flutter/material.dart';

class ImageCompressDialog extends StatelessWidget {
  final VoidCallback onCancel;
  final VoidCallback onConfirm;

  ImageCompressDialog({this.onCancel, this.onConfirm});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Compress Image"),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 8,
      content: Text("Do You Want To Compress Image Before Uploading?"),
      actions: <Widget>[
        FlatButton(
          child: new Text("Cancel"),
          onPressed: onCancel,
        ),
        FlatButton(
          child: new Text("Compress"),
          onPressed: onConfirm,
        ),
      ],
    );
  }
}
