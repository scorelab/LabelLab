import 'package:flutter/material.dart';

class DeleteConfirmDialog extends StatelessWidget {
  final String? name;
  final VoidCallback? onCancel;
  final VoidCallback? onConfirm;

  DeleteConfirmDialog({this.name, this.onCancel, this.onConfirm});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Delete $name"),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 8,
      content: Text("This can't be undone. Are you sure?"),
      actions: <Widget>[
        FlatButton(
          child: new Text("Cancel"),
          onPressed: onCancel,
        ),
        FlatButton(
          child: new Text("Delete"),
          onPressed: onConfirm,
        ),
      ],
    );
  }
}
