import 'package:flutter/material.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';

class AddTeamMemberDialog extends StatefulWidget {
  final VoidCallback? onCancel;
  final Function? onConfirm;

  AddTeamMemberDialog({this.onCancel, this.onConfirm});

  @override
  _AddTeamMemberDialogState createState() => _AddTeamMemberDialogState();
}

class _AddTeamMemberDialogState extends State<AddTeamMemberDialog> {
  String? _error;
  final _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Add Team Member"),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 8,
      content: Container(
        height: 120,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            LabelTextField(
              controller: _controller,
              labelText: 'Email',
            ),
            SizedBox(height: 10),
            _error != null
                ? Text(
                    _error!,
                    style: TextStyle(
                      color: Colors.red,
                      fontSize: 12,
                    ),
                  )
                : Container(),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: new Text("Cancel"),
          onPressed: widget.onCancel,
        ),
        TextButton(
          child: new Text("Add Member"),
          onPressed: _addTeamMember,
        ),
      ],
    );
  }

  void _addTeamMember() {
    String email = _controller.text;
    if (email.isEmpty) {
      _setError('Please enter an email');
      return;
    }
    widget.onConfirm!(email);
  }

  void _setError(String error) {
    setState(() {
      _error = error;
    });
  }
}
