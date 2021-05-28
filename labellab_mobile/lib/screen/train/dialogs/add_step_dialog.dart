import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/mapper/ml_model_mapper.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/step_dto.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';

class AddStepDialog extends StatefulWidget {
  @override
  _AddStepDialogState createState() => _AddStepDialogState();
}

class _AddStepDialogState extends State<AddStepDialog> {
  ModelStep? _currentValue;

  // Extra args
  List<String> _typeextras = ["Samplewise", "Featurewise"];
  String? _currenttypeExtra;

  TextEditingController _extraRangeController = TextEditingController();
  TextEditingController _extraFactorController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Select Step"),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 8,
      content: SingleChildScrollView(
        child: Column(
          children: <Widget>[
            DropdownButton(
              value: _currentValue,
              items: <ModelStep>[
                ModelStep.CENTER,
                ModelStep.STDNORM,
                ModelStep.RR,
                ModelStep.WSR,
                ModelStep.HSR,
                ModelStep.SR,
                ModelStep.ZR,
                ModelStep.CSR,
                ModelStep.HF,
                ModelStep.VF,
                ModelStep.RESCALE,
              ]
                  .map((step) => DropdownMenuItem<ModelStep>(
                        value: step,
                        child: Text(
                          MlModelMapper.stepToString(step),
                          style: TextStyle(fontSize: 14),
                        ),
                      ))
                  .toList(),
              onChanged: (ModelStep? value) {
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
          onPressed: _currentValue != null
              ? () {
                  switch (_currentValue) {
                    case ModelStep.CENTER:
                    case ModelStep.STDNORM:
                      Navigator.pop(
                          context,
                          StepDto(
                              step: _currentValue, extra: _currenttypeExtra));
                      break;

                    case ModelStep.RR:
                    case ModelStep.WSR:
                    case ModelStep.HSR:
                    case ModelStep.SR:
                    case ModelStep.ZR:
                    case ModelStep.CSR:
                      Navigator.pop(
                          context,
                          StepDto(
                              step: _currentValue,
                              extra: _extraRangeController.text));
                      break;

                    case ModelStep.RESCALE:
                      Navigator.pop(
                          context,
                          StepDto(
                              step: _currentValue,
                              extra: _extraFactorController.text));
                      break;

                    default:
                      Navigator.pop(
                          context, StepDto(step: _currentValue, extra: ""));
                  }
                }
              : null,
        ),
      ],
    );
  }

  Widget _buildExtraArgs(ModelStep? currentValue) {
    switch (currentValue) {
      case ModelStep.CENTER:
      case ModelStep.STDNORM:
        return DropdownButton(
          value: _currenttypeExtra,
          items: _typeextras
              .map((extra) => DropdownMenuItem<String>(
                    value: extra,
                    child: Text(
                      extra,
                      style: TextStyle(fontSize: 14),
                    ),
                  ))
              .toList(),
          onChanged: (String? value) {
            setState(() {
              _currenttypeExtra = value;
            });
          },
        );

      case ModelStep.RR:
      case ModelStep.WSR:
      case ModelStep.HSR:
      case ModelStep.SR:
      case ModelStep.ZR:
      case ModelStep.CSR:
        return LabelTextField(
          keyboardType: TextInputType.number,
          labelText: "Range",
          controller: _extraRangeController,
        );

      case ModelStep.RESCALE:
        return LabelTextField(
          keyboardType: TextInputType.number,
          labelText: "Factor",
          controller: _extraFactorController,
        );

      default:
        return Container();
    }
  }
}
