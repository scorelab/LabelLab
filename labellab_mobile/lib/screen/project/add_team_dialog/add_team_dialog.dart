import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/widgets/custom_dropdown.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';

class AddTeamDialog extends StatefulWidget {
  final String projectId;
  final List<String> memberEmails;

  AddTeamDialog(this.projectId, this.memberEmails);

  @override
  _AddTeamDialogState createState() => _AddTeamDialogState();
}

class _AddTeamDialogState extends State<AddTeamDialog> {
  Repository _repository = Repository();
  bool _isLoading = false;
  String? _error;
  final _nameController = TextEditingController();
  final _roles = [
    'images',
    'labels',
    'models',
    'image labelling',
  ];
  String? _role;
  String? _memberEmail;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Add Team"),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 8,
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            LabelTextField(
              controller: _nameController,
              labelText: "Team Name",
              textCapitalization: TextCapitalization.words,
            ),
            SizedBox(height: 15),
            Text(
              'Team role',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 12,
              ),
            ),
            CustomDropdown(_roles, _setRole, isDisabled: _isLoading),
            SizedBox(height: 15),
            Text(
              'Select a member',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 12,
              ),
            ),
            CustomDropdown(widget.memberEmails, _setMemberEmail,
                isDisabled: _isLoading),
            SizedBox(height: 15),
            this._error != null
                ? Text(this._error!, style: TextStyle(color: Colors.redAccent))
                : Container(),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: Text("Cancel"),
          onPressed: () => Navigator.pop(context, false),
        ),
        TextButton(
          child: Text("Add"),
          onPressed: !_isLoading ? _addTeam : null,
        ),
      ],
    );
  }

  void _addTeam() {
    String teamName = _nameController.text;
    if (teamName.isEmpty) {
      _setError("Please provide a team name");
      return;
    }
    _toggleIsLoading(true);
    Map<String, dynamic> postData = {
      "member_email": _memberEmail,
      "team_name": teamName,
      "role": _role,
    };
    _repository.createTeam(widget.projectId, postData).then((res) {
      if (res.success!) {
        _toggleIsLoading(false);
        Navigator.pop(context, true);
      } else {
        _toggleIsLoading(false);
        _setError(res.msg ?? 'Something went wrong');
      }
    }).catchError((err) {
      _setError(err.message.toString());
      _toggleIsLoading(false);
    });
  }

  void _setRole(String value) {
    _role = value;
  }

  void _setMemberEmail(String value) {
    _memberEmail = value;
  }

  void _setError(String error) {
    setState(() {
      _error = error;
    });
  }

  void _toggleIsLoading(bool value) {
    setState(() {
      _isLoading = value;
    });
  }
}
