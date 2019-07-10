import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';

class AddEditProjectScreen extends StatefulWidget {
  final Repository _repository = Repository();
  final String id;

  AddEditProjectScreen({this.id});

  @override
  _AddEditProjectScreenState createState() => _AddEditProjectScreenState();
}

class _AddEditProjectScreenState extends State<AddEditProjectScreen> {
  String _projectId;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  bool _isLoading = false;
  String _error;

  @override
  void initState() {
    if (_editing) {
      _loadProjectLogic();
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_editing ? "Edit project" : "Add project"),
        elevation: 0,
        backgroundColor: Theme.of(context).canvasColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            LabelTextField(
              controller: _nameController,
              labelText: "Project name",
              textCapitalization: TextCapitalization.words,
            ),
            SizedBox(
              height: 8,
            ),
            LabelTextField(
                controller: _descriptionController,
                labelText: "Project description",
                textCapitalization: TextCapitalization.sentences),
            this._error != null
                ? Text(
                    this._error,
                    style: TextStyle(color: Colors.red),
                  )
                : Container(),
            SizedBox(
              height: 16,
            ),
            RaisedButton(
              elevation: 0,
              color: Theme.of(context).accentColor,
              colorBrightness: Brightness.dark,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              padding: EdgeInsets.symmetric(vertical: 16.0),
              child: Text(_buttonText),
              onPressed: _isLoading ? null : () => _update(context),
            ),
          ],
        ),
      ),
    );
  }

  void _update(BuildContext context) {
    setState(() {
      _isLoading = true;
    });
    final Project _project = Project();
    _project.id = _projectId;
    _project.name = _nameController.text;
    _project.description = _descriptionController.text;
    _updateLogic(_project).then((String message) {
      if (message == "Success") {
        Application.router.pop(context);
      } else {
        setState(() {
          _error = message;
          _isLoading = false;
        });
      }
    }).catchError((err) {
      if (err is DioError) {
        if (err.response != null && err.response.data is Map) {
          setState(() {
            _error = err.response.data['msg'].toString();
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

  Future<String> _updateLogic(Project project) {
    if (project.id == null) {
      // Create new project
      return widget._repository.createProject(project).then((res) {
        if (!res.success) return res.msg;
        return "Success";
      });
    } else {
      // Update the existing project
      return widget._repository.updateProject(project).then((res) {
        if (!res.success) return res.msg;
        return "Success";
      });
    }
  }

  void _loadProjectLogic() {
    widget._repository.getProject(widget.id).then((Project project) {
      print(project.description);
      setState(() {
        _projectId = project.id;
        _nameController.text = project.name;
        _descriptionController.text = project.description;
      });
    });
  }

  String get _buttonText {
    if (_editing) {
      return _isLoading ? "Updating..." : "Update";
    } else {
      return _isLoading ? "Creating..." : "Create";
    }
  }

  bool get _editing => widget.id != null;
}
