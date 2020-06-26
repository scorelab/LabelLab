import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/group.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';

class AddEditGroupDialog extends StatefulWidget {
  final Repository _repository = Repository();
  final String projectId;
  final Group group;

  AddEditGroupDialog(this.projectId, {this.group});

  @override
  AddEditGroupDialogState createState() => AddEditGroupDialogState();
}

class AddEditGroupDialogState extends State<AddEditGroupDialog> {
  String _groupId;
  String _error;

  bool _isLoading = false;

  final TextEditingController _nameController = TextEditingController();

  bool get _isEditing => widget.group != null;

  String get _buttonText => _isEditing
      ? !_isLoading ? "Update" : "Updating..."
      : !_isLoading ? "Create" : "Creating...";

  @override
  void initState() {
    if (_isEditing) _loadGroup();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(_isEditing ? "Edit " : "Add " + "Group"),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 8,
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            LabelTextField(
              controller: _nameController,
              labelText: "Group Name",
              textCapitalization: TextCapitalization.words,
            ),
            SizedBox(
              height: 16,
            ),
            this._error != null
                ? Text(this._error, style: TextStyle(color: Colors.redAccent))
                : Container(),
          ],
        ),
      ),
      actions: <Widget>[
        FlatButton(
          child: Text("Cancel"),
          onPressed: () => Navigator.pop(context, false),
        ),
        FlatButton(
          child: Text(_buttonText),
          onPressed: !_isLoading ? () => update() : null,
        ),
      ],
    );
  }

  void _loadGroup() {
    setState(() {
      _groupId = widget.group.id;
      _nameController.text = widget.group.name;
    });
  }

  void update() {
    setState(() {
      _isLoading = true;
    });

    final Group _group = Group();
    _group.id = _groupId;
    _group.name = _nameController.text;

    _updateHelper(_group).then((String msg) {
      if (msg == "Success")
        Navigator.pop(context, true);
      else
        setState(() {
          _error = msg;
          _isLoading = false;
        });
    }).catchError((error) {
      setState(() {
        _error = error.response ? error.response.toString() : error.toString();
      });
    });
  }

  Future<String> _updateHelper(Group group) {
    if (group.id == null) {
      return widget._repository
          .createGroup(widget.projectId, group)
          .then((res) => res.success ? "Success" : res.msg);
    } else {
      return widget._repository
          .updateGroup(group)
          .then((res) => res.success ? "Success" : res.msg);
    }
  }
}
