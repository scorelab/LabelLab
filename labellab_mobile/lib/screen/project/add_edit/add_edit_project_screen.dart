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
  final TextEditingController _controller = TextEditingController();
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
              controller: _controller,
              labelText: "Project name",
              textCapitalization: TextCapitalization.words,
              errorText: _error != null ? _error : null,
            ),
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
    String projectName = _controller.text.toString();
    if (projectName.isEmpty) {
      setState(() {
        _error = "Can't be empty";
        return;
      });
    }
    setState(() {
      _isLoading = true;
    });
    final Project project = Project();
    project.id = widget.id;
    project.name = projectName;
    _updateLogic(project).then((String message) {
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
      setState(() {
        _controller.text = project.name;
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
