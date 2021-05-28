import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/mapper/ml_model_mapper.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';

class AddEditModelDialog extends StatefulWidget {
  @override
  _AddEditModelDialogState createState() => _AddEditModelDialogState();

  final Repository _repository = Repository();
  final String projectId;
  final MlModel? model;

  AddEditModelDialog(this.projectId, {this.model});
}

class _AddEditModelDialogState extends State<AddEditModelDialog> {
  bool _isLoading = false;
  String? _error;

  final TextEditingController _nameController = TextEditingController();
  ModelType? _currentType = ModelType.CLASSIFIER;
  ModelSource? _currentSource = ModelSource.TRANSFER;

  bool get _editing => widget.model != null;

  @override
  void initState() {
    if (_editing) {
      _loadModel();
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(_editing ? "Edit model" : "Add model"),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 8,
      content: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            LabelTextField(
              controller: _nameController,
              labelText: "Model Name",
            ),
            SizedBox(height: 16),
            Text("Model Type"),
            Center(
              child: DropdownButton(
                value: _currentType,
                items: <ModelType>[
                  ModelType.CLASSIFIER,
                ]
                    .map((value) => DropdownMenuItem<ModelType>(
                          value: value,
                          child: Text(MlModelMapper.typeToString(value)),
                        ))
                    .toList(),
                onChanged: (ModelType? value) {
                  setState(() {
                    _currentType = value;
                  });
                },
              ),
            ),
            SizedBox(height: 16),
            Text("Model Source"),
            Center(
              child: DropdownButton(
                value: _currentSource,
                items: <ModelSource>[
                  ModelSource.TRANSFER,
                  ModelSource.UPLOAD,
                  ModelSource.CUSTOM
                ]
                    .map((value) => DropdownMenuItem<ModelSource>(
                          value: value,
                          child: Text(MlModelMapper.sourceToString(value)),
                        ))
                    .toList(),
                onChanged: (ModelSource? value) {
                  setState(() {
                    _currentSource = value;
                  });
                },
              ),
            ),
            SizedBox(height: 16),
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
    MlModel _model = MlModel.fromData(
        name: _nameController.text, type: _currentType, source: _currentSource);
    if (_editing) _model.id = widget.model!.id;
    _updateLogic(_model).then((String message) {
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

  Future<String> _updateLogic(MlModel model) {
    if (widget.model == null) {
      // Create new model
      return widget._repository
          .createModel(widget.projectId, model)
          .then((res) {
        if (!res.success!) return res.msg!;
        return "Success";
      });
    } else {
      // Update existing model
      print('Update');
      return widget._repository
          .updateModel(widget.projectId, model)
          .then((res) {
        if (!res.success!) return res.msg!;
        return "Success";
      });
    }
  }

  String get _buttonText {
    if (_editing) {
      return _isLoading ? "Updating..." : "Update";
    } else {
      return _isLoading ? "Creating..." : "Create";
    }
  }

  void _loadModel() {
    setState(() {
      _nameController.text = widget.model!.name!;
      _currentType = widget.model!.type;
      _currentSource = widget.model!.source;
    });
  }
}
