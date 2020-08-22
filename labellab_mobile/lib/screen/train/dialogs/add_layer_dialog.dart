import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:labellab_mobile/model/mapper/ml_model_mapper.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';

class AddLayerDialog extends StatefulWidget {
  @override
  _AddLayerDialogState createState() => _AddLayerDialogState();
}

class _AddLayerDialogState extends State<AddLayerDialog> {
  ModelLayer _currentValue;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Select Layer"),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 8,
      content: SingleChildScrollView(
        child: Column(
          children: <Widget>[
            DropdownButton(
              value: _currentValue,
              items: <ModelLayer>[
                ModelLayer.C2D,
                ModelLayer.ACTIVATION,
                ModelLayer.MAXPOOL2D,
                ModelLayer.GAP2D,
                ModelLayer.DENSE,
                ModelLayer.DROPOUT,
                ModelLayer.FLATTEN,
              ]
                  .map((layer) => DropdownMenuItem<ModelLayer>(
                        value: layer,
                        child: Text(
                          MlModelMapper.layerToString(layer),
                          style: TextStyle(fontSize: 14),
                        ),
                      ))
                  .toList(),
              onChanged: (ModelLayer value) {
                setState(() {
                  _currentValue = value;
                });
              },
            ),
            SizedBox(height: 16),
            _buildExtraArgs(_currentValue)
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
          onPressed: _currentValue != null ? () {} : null,
        ),
      ],
    );
  }

  Widget _buildExtraArgs(ModelLayer currentValue) {
    switch (currentValue) {
      case ModelLayer.C2D:
        return Column(
          children: <Widget>[
            LabelTextField(
              labelText: "Filters",
            ),
            SizedBox(height: 8),
            LabelTextField(
              labelText: "Kernel Size",
            ),
            SizedBox(height: 8),
            LabelTextField(
              labelText: "X Strides",
            ),
            SizedBox(height: 8),
            LabelTextField(
              labelText: "Y Strides",
            ),
          ],
        );

      case ModelLayer.ACTIVATION:
        return DropdownButton(
          // value: _currenttypeExtra,
          items: <String>[]
              .map((extra) => DropdownMenuItem<String>(
                    value: extra,
                    child: Text(
                      extra,
                      style: TextStyle(fontSize: 14),
                    ),
                  ))
              .toList(),
          onChanged: (String value) {
            setState(() {
              // _currenttypeExtra = value;
            });
          },
        );

      default:
        return Container();
    }
  }
}
