import 'package:flutter/material.dart';

class DeleteConfirmDialog extends StatelessWidget {
  final String? name;
  final VoidCallback? onCancel;
  final VoidCallback? onConfirm;
  final bool positiveIntent;

  DeleteConfirmDialog(
      {this.name, this.onCancel, this.onConfirm, this.positiveIntent = false});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(positiveIntent ? "Create $name" : "Delete $name"),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 8,
      content: Text(positiveIntent
          ? "Press confirm to save"
          : "This can't be undone. Are you sure?"),
      actions: <Widget>[
        TextButton(
          child: new Text("Cancel"),
          onPressed: onCancel,
        ),
        TextButton(
          child: new Text(positiveIntent ? "Confirm" : "Delete"),
          onPressed: onConfirm,
        ),
      ],
    );
  }
}
