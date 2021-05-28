import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';

typedef void OnUpdateError(String message);

class AddEditLabelDialog extends StatefulWidget {
  final Repository _repository = Repository();
  final String projectId;
  final Label? label;

  AddEditLabelDialog(this.projectId, {this.label});

  @override
  _AddEditProjectScreenState createState() => _AddEditProjectScreenState();
}

class _AddEditProjectScreenState extends State<AddEditLabelDialog> {
  String? _labelId;

  int _type = 0;

  bool _isLoading = false;
  String? _error;

  final TextEditingController _nameController = TextEditingController();

  @override
  void initState() {
    if (_editing) {
      _loadLabel();
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(_editing ? "Edit label" : "Add label"),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 8,
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            LabelTextField(
              controller: _nameController,
              labelText: "Label name",
              textCapitalization: TextCapitalization.words,
            ),
            Padding(
              padding: const EdgeInsets.only(top: 16.0),
              child: Text("Type"),
            ),
            ListTile(
              contentPadding: EdgeInsets.all(0),
              leading: Radio(
                value: 0,
                groupValue: _type,
                onChanged: (dynamic _) {
                  setState(() {
                    _type = 0;
                  });
                },
              ),
              title: Text("Rectangle"),
            ),
            ListTile(
              contentPadding: EdgeInsets.all(0),
              leading: Radio(
                value: 1,
                groupValue: _type,
                onChanged: (dynamic _) {
                  setState(() {
                    _type = 1;
                  });
                },
              ),
              title: Text("Polygon"),
            ),
            this._error != null
                ? Text(
                    this._error!,
                    style: TextStyle(color: Colors.red),
                  )
                : Container(),
          ],
        ),
      ),
      actions: <Widget>[
        FlatButton(
          child: new Text("Cancel"),
          onPressed: () => Navigator.pop(context, false),
        ),
        FlatButton(
          child: new Text(_buttonText),
          onPressed: !_isLoading ? () => _update(context) : null,
        ),
      ],
    );
  }

  void _update(BuildContext context) {
    setState(() {
      _isLoading = true;
    });
    final Label _label = Label();
    _label.id = _labelId;
    _label.name = _nameController.text;
    _label.type = _type == 0 ? LabelType.RECTANGLE : LabelType.POLYGON;
    _updateLogic(_label).then((String message) {
      if (message == "Success") {
        Navigator.pop(context, true);
      } else {
        setState(() {
          // _error = message;
          _isLoading = false;
        });
        Navigator.pop(context, false);
      }
    }).catchError((err) {
      if (err is DioError) {
        if (err.response != null && err.response!.data is Map) {
          setState(() {
            _error = err.response!.data['msg'].toString();
            _isLoading = false;
          });
        } else {
          setState(() {
            _error = err.response.toString();
            _isLoading = false;
          });
        }
      } else {
        setState(() {
          _error = err.toString();
          _isLoading = false;
        });
      }
    });
  }

  Future<String> _updateLogic(Label label) {
    if (label.id == null) {
      // Create new label
      return widget._repository
          .createLabel(widget.projectId, label)
          .then((res) {
        if (!res.success!) return res.msg!;
        return "Success";
      });
    } else {
      // Update the existing label
      return widget._repository
          .updateLabel(widget.projectId, label)
          .then((res) {
        if (!res.success!) return res.msg!;
        return "Success";
      });
    }
  }

  void _loadLabel() {
    setState(() {
      _labelId = widget.label!.id;
      _nameController.text = widget.label!.name!;
      if (widget.label!.type == "Rectangle") {
        _type = 0;
      } else {
        _type = 1;
      }
    });
  }

  String get _buttonText {
    if (_editing) {
      return _isLoading ? "Updating..." : "Update";
    } else {
      return _isLoading ? "Creating..." : "Create";
    }
  }

  bool get _editing => widget.label != null;
}
