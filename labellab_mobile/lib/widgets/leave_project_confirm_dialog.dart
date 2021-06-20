import 'package:flutter/material.dart';

class LeaveProjectConfirmDialog extends StatelessWidget {
  final String? name;
  final VoidCallback? onCancel;
  final VoidCallback? onConfirm;

  LeaveProjectConfirmDialog({this.name, this.onCancel, this.onConfirm});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Leave $name"),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 8,
      content: Text("This can't be undone. Are you sure?"),
      actions: <Widget>[
        TextButton(
          child: new Text("Cancel"),
          onPressed: onCancel,
        ),
        TextButton(
          child: new Text("Leave"),
          onPressed: onConfirm,
        ),
      ],
    );
  }
}
