import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/issue.dart';
import 'package:labellab_mobile/model/mapper/issue_mapper.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/widgets/label_text_form_field.dart';

class AddEditIssueScreen extends StatefulWidget {
  final Repository _repository = Repository();
  final String? id;
  final String? project_id;

  AddEditIssueScreen({this.project_id, this.id});

  @override
  _AddEditIssueScreenState createState() => _AddEditIssueScreenState();
}

class _AddEditIssueScreenState extends State<AddEditIssueScreen> {
  GlobalKey<FormState> _key = GlobalKey();
  // int? _projectId;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  bool _isLoading = false;
  String? _error;

  final _categoryOptions = [
    'General',
    'Images',
    'Labels',
    'Models',
    'Labelling',
    'Misc'
  ];

  String _selectedCategory = 'General';
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
        iconTheme: IconThemeData(
          color: Colors.black,
        ),
        backgroundColor: Colors.white,
        title: Text(
          _editing ? "Edit Issue" : "Add Issue",
          style: TextStyle(color: Colors.black),
        ),
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _key,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              LabelTextFormField(
                key: Key('issue_title'),
                onSaved: (String text) {
                  _nameController.text = text.trim();
                },
                labelText: "Issue Title",
                textCapitalization: TextCapitalization.words,
                validator: _validateName,
                controller: _nameController,
              ),
              SizedBox(
                height: 8,
              ),
              LabelTextFormField(
                key: Key('issue_description'),
                onSaved: (String text) {
                  _descriptionController.text = text.trim();
                },
                labelText: "issue description",
                textCapitalization: TextCapitalization.sentences,
                validator: _validateDescription,
                controller: _descriptionController,
              ),
              Center(
                child: DropdownButton(
                  key: Key("issue_category"),
                  value:
                      _selectedCategory.isNotEmpty ? _selectedCategory : null,
                  icon: const Icon(Icons.keyboard_arrow_down),
                  items: _categoryOptions.map((String items) {
                    return DropdownMenuItem(
                      value: items,
                      child: Text(items),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedCategory = newValue!;
                    });
                  },
                ),
              ),
              this._error != null
                  ? Text(
                      this._error!,
                      style: TextStyle(color: Colors.red),
                    )
                  : Container(),
              SizedBox(
                height: 16,
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  elevation: 0,
                  primary: Theme.of(context).accentColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: EdgeInsets.symmetric(vertical: 16.0),
                ),
                child: Text(_buttonText),
                onPressed: _isLoading ? null : () => _update(context),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String? _validateName(String name) {
    if (name.isEmpty) {
      return 'Please enter apporitate Title';
    }
    return null;
  }

  String? _validateDescription(String description) {
    if (description.isEmpty) {
      return 'Please enter a description';
    }
    return null;
  }

  void _update(BuildContext context) async {
    final form = _key.currentState!;
    if (!form.validate()) return;
    form.save();
    setState(() {
      _isLoading = true;
    });

    final Issue _issue = _editing
        ? await widget._repository.getIssue(widget.project_id, widget.id)
        : Issue();
    _issue.project_id = int.parse(widget.project_id!);
    _issue.issueTitle = _nameController.text;
    _issue.description = _descriptionController.text;
    _issue.issueCategory =
        IssueMapper.mapJsonToCategory(_selectedCategory.toLowerCase());
    _updateLogic(_issue).then((String message) {
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

  Future<String> _updateLogic(Issue issue) {
    if (issue.id == null) {
      // Create new issue
      return widget._repository.createIssue(issue).then((res) {
        if (!res.success!) return res.msg!;
        return "Success";
      });
    } else {
      // Update the existing issue
      return widget._repository.updateIssue(issue).then((res) {
        if (!res.success!) return res.msg!;
        return "Success";
      });
    }
  }

  void _loadProjectLogic() {
    widget._repository
        .getIssue(widget.project_id, widget.id)
        .then((Issue issue) {
      // print(issue.description);
      setState(() {
        widget.project_id != issue.project_id.toString();
        _nameController.text = issue.issueTitle!;
        _descriptionController.text = issue.description!;
        _selectedCategory = IssueMapper.categoryToString(issue.issueCategory);
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
