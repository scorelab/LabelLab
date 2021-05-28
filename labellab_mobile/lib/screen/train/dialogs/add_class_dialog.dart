import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/label.dart';

class AddClassDialog extends StatefulWidget {
  @override
  _AddClassDialogState createState() => _AddClassDialogState();

  final List<Label>? labels;
  AddClassDialog(this.labels);
}

class _AddClassDialogState extends State<AddClassDialog> {
  String? _currentValue;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Select class"),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 8,
      content: SingleChildScrollView(
        child: Column(
          children: <Widget>[
            DropdownButton(
              value: _currentValue,
              items: widget.labels!
                  .map((label) => DropdownMenuItem<String>(
                        value: label.id,
                        child: Text(
                          label.name!,
                          style: TextStyle(fontSize: 14),
                        ),
                      ))
                  .toList(),
              onChanged: (String? value) {
                setState(() {
                  _currentValue = value;
                });
              },
            ),
            SizedBox(height: 16),
            _currentValue != null
                ? Text("Selected class has " +
                    widget.labels!
                        .where((label) => label.id == _currentValue)
                        .first
                        .imageIds
                        .length
                        .toString() +
                    " image(s)")
                : Container(),
          ],
        ),
      ),
      actions: <Widget>[
        FlatButton(
          child: new Text("Cancel"),
          onPressed: () => Navigator.pop(context),
        ),
        FlatButton(
          child: new Text("Add"),
          onPressed: _currentValue != null
              ? () => Navigator.pop(context, _currentValue)
              : null,
        ),
      ],
    );
  }
}
