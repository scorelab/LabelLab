import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:labellab_mobile/model/mapper/ml_model_mapper.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/layer_dto.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';

class AddLayerDialog extends StatefulWidget {
  @override
  _AddLayerDialogState createState() => _AddLayerDialogState();
}

class _AddLayerDialogState extends State<AddLayerDialog> {
  ModelLayer? _currentValue;

  // Extra args
  List<String> _activationExtra = [
    "Relu",
    "Exponential",
    "Linear",
    "Sigmoid",
    "Softmax",
    "Tanh"
  ];
  String? _currentActivationExtra;

  TextEditingController _extraFiltersController = TextEditingController();
  TextEditingController _extraKernelSizeController = TextEditingController();
  TextEditingController _extraXStridesController = TextEditingController();
  TextEditingController _extraYStridesController = TextEditingController();

  TextEditingController _extraPoolXController = TextEditingController();
  TextEditingController _extraPoolYController = TextEditingController();

  TextEditingController _extraUnitsController = TextEditingController();
  TextEditingController _extraRateController = TextEditingController();

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
              onChanged: (ModelLayer? value) {
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
        TextButton(
          child: new Text("Cancel"),
          onPressed: () => Navigator.pop(context),
        ),
        TextButton(
          child: new Text("Add"),
          onPressed: _currentValue != null
              ? () {
                  switch (_currentValue) {
                    case ModelLayer.C2D:
                      List<String> _args = [];
                      _args.add(_extraFiltersController.text);
                      _args.add(_extraKernelSizeController.text);
                      _args.add(_extraXStridesController.text);
                      _args.add(_extraYStridesController.text);

                      Navigator.pop(
                          context, LayerDto(layer: _currentValue, args: _args));
                      break;

                    case ModelLayer.ACTIVATION:
                      List<String?> _args = [];
                      _args.add(_currentActivationExtra);

                      Navigator.pop(
                          context, LayerDto(layer: _currentValue, args: _args));
                      break;

                    case ModelLayer.MAXPOOL2D:
                      List<String> _args = [];
                      _args.add(_extraPoolXController.text);
                      _args.add(_extraPoolYController.text);

                      Navigator.pop(
                          context, LayerDto(layer: _currentValue, args: _args));
                      break;

                    case ModelLayer.DENSE:
                      List<String> _args = [];
                      _args.add(_extraUnitsController.text);

                      Navigator.pop(
                          context, LayerDto(layer: _currentValue, args: _args));
                      break;

                    case ModelLayer.DROPOUT:
                      List<String> _args = [];
                      _args.add(_extraRateController.text);

                      Navigator.pop(
                          context, LayerDto(layer: _currentValue, args: _args));
                      break;

                    default:
                      Navigator.pop(
                          context, LayerDto(layer: _currentValue, args: []));
                  }
                }
              : null,
        ),
      ],
    );
  }

  Widget _buildExtraArgs(ModelLayer? currentValue) {
    switch (currentValue) {
      case ModelLayer.C2D:
        return Column(
          children: <Widget>[
            LabelTextField(
              keyboardType: TextInputType.number,
              labelText: "Filters",
              controller: _extraFiltersController,
            ),
            SizedBox(height: 8),
            LabelTextField(
              keyboardType: TextInputType.number,
              labelText: "Kernel Size",
              controller: _extraKernelSizeController,
            ),
            SizedBox(height: 8),
            LabelTextField(
              keyboardType: TextInputType.number,
              labelText: "X Strides",
              controller: _extraXStridesController,
            ),
            SizedBox(height: 8),
            LabelTextField(
              keyboardType: TextInputType.number,
              labelText: "Y Strides",
              controller: _extraYStridesController,
            ),
          ],
        );

      case ModelLayer.ACTIVATION:
        return DropdownButton(
          value: _currentActivationExtra,
          items: _activationExtra
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
              _currentActivationExtra = value;
            });
          },
        );

      case ModelLayer.MAXPOOL2D:
        return Column(
          children: <Widget>[
            LabelTextField(
              keyboardType: TextInputType.number,
              labelText: "Pool size X",
              controller: _extraPoolXController,
            ),
            SizedBox(height: 8),
            LabelTextField(
              keyboardType: TextInputType.number,
              labelText: "Pool size Y",
              controller: _extraPoolYController,
            ),
          ],
        );

      case ModelLayer.DENSE:
        return LabelTextField(
          keyboardType: TextInputType.number,
          labelText: "Units",
          controller: _extraUnitsController,
        );

      case ModelLayer.DROPOUT:
        return LabelTextField(
          keyboardType: TextInputType.number,
          labelText: "Rate",
          controller: _extraRateController,
        );

      default:
        return Container();
    }
  }
}
