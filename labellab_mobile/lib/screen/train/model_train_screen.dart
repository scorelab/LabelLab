import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/mapper/ml_model_mapper.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/screen/train/dialogs/add_class_dialog.dart';
import 'package:labellab_mobile/screen/train/dialogs/add_layer_dialog.dart';
import 'package:labellab_mobile/screen/train/dialogs/add_step_dialog.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/layer_dto.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/model_dto.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/step_dto.dart';
import 'package:labellab_mobile/screen/train/model_train_bloc.dart';
import 'package:labellab_mobile/screen/train/model_train_state.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';
import 'package:provider/provider.dart';
import 'package:charts_flutter/flutter.dart' as charts;

class ModelTrainScreen extends StatefulWidget {
  @override
  _ModelTrainScreenState createState() => _ModelTrainScreenState();
}

class _ModelTrainScreenState extends State<ModelTrainScreen> {
  ModelToLearn _currentLearningOn;
  ModelLoss _currentLoss;
  ModelOptimizer _currentOptimizer;
  ModelMetric _currentMetric;

  TextEditingController _trainController = TextEditingController();
  TextEditingController _validationController = TextEditingController();
  TextEditingController _testController = TextEditingController();
  TextEditingController _epochsController = TextEditingController();
  TextEditingController _batchSizeController = TextEditingController();
  TextEditingController _learningRateController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Train model"),
        elevation: 0,
      ),
      body: StreamBuilder<ModelTrainState>(
        stream: Provider.of<ModelTrainBloc>(context).state,
        initialData: ModelTrainState.initial(),
        builder:
            (BuildContext context, AsyncSnapshot<ModelTrainState> snapshot) {
          if (snapshot.hasData) {
            final ModelTrainState _state = snapshot.data;
            if (_state.isLoading)
              return _buildLoadingBody();
            else
              return _buildPreTrainBody(_state.labels, _state.currentClasses,
                  _state.currentSteps, _state.currentLayers);
          }
          return Container();
        },
      ),
    );
  }

  SingleChildScrollView _buildPreTrainBody(
      List<Label> labels,
      List<Label> currentClasses,
      List<StepDto> currentSteps,
      List<LayerDto> currentLayers) {
    return SingleChildScrollView(
      child: Container(
        margin: EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              "Classes",
              style: Theme.of(context).textTheme.headline6,
            ),
            SizedBox(height: 8),
            _buildCurrentClasses(currentClasses),
            SizedBox(height: 16),
            _buildAddClassButton(labels),
            SizedBox(height: 16),
            Text(
              "Train",
              style: Theme.of(context).textTheme.headline6,
            ),
            SizedBox(height: 8),
            _buildTrainBody(currentSteps, currentLayers),
            SizedBox(height: 24),
            _buildTrainButton(),
            SizedBox(height: 24)
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentClasses(List<Label> currentClasses) {
    return currentClasses != null
        ? Column(
            children: currentClasses
                .map((c) => Container(
                      margin: EdgeInsets.symmetric(vertical: 8),
                      height: 48,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          border:
                              Border.all(color: Theme.of(context).accentColor)),
                      child: Container(
                        margin: EdgeInsets.symmetric(horizontal: 16),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: <Widget>[
                            Text(c.name),
                            Row(
                              children: <Widget>[
                                Text(
                                    c.imageIds.length.toString() + " image(s)"),
                                SizedBox(width: 8),
                                InkWell(
                                  child: Icon(Icons.close, size: 16),
                                  onTap: () {
                                    Provider.of<ModelTrainBloc>(context)
                                        .removeClass(c);
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ))
                .toList(),
          )
        : Center(
            child: Container(
              child: Text("No classes yet"),
            ),
          );
  }

  Widget _buildLoadingBody() {
    return Container(
      child: LinearProgressIndicator(
        backgroundColor: Theme.of(context).canvasColor,
      ),
    );
  }

  Widget _buildAddClassButton(List<Label> labels) {
    return Container(
      child: InkWell(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Container(
            height: 48,
            color: Colors.black12,
            child: Container(
              margin: EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Icon(Icons.add),
                  SizedBox(width: 8),
                  Text("Add new class"),
                ],
              ),
            ),
          ),
        ),
        onTap: () => _showAddClassDialog(context, labels),
      ),
    );
  }

  Widget _buildTrainBody(List<StepDto> steps, List<LayerDto> layers) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            Text(
              "Pre processing steps",
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
            FlatButton.icon(
              icon: Icon(Icons.add),
              label: Text("Add"),
              onPressed: () => _showAddStepsDialog(context),
            ),
          ],
        ),
        SizedBox(height: 8),
        steps != null
            ? Wrap(
                spacing: 8,
                children: steps
                    .map((step) => Chip(
                          label: Text(MlModelMapper.stepToString(step.step) +
                              (step.extra != "" ? " | " : "") +
                              step.extra.toString()),
                          deleteIcon: Icon(Icons.cancel),
                          onDeleted: () {
                            Provider.of<ModelTrainBloc>(context)
                                .removeStep(step);
                          },
                        ))
                    .toList(),
              )
            : Container(),
        SizedBox(height: 16),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Train")),
            Expanded(
                child: LabelTextField(
              keyboardType: TextInputType.number,
              controller: _trainController,
            )),
          ],
        ),
        SizedBox(height: 8),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Validation")),
            Expanded(
                child: LabelTextField(
              keyboardType: TextInputType.number,
              controller: _validationController,
            )),
          ],
        ),
        SizedBox(height: 8),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Test")),
            Expanded(
                child: LabelTextField(
              keyboardType: TextInputType.number,
              controller: _testController,
            )),
          ],
        ),
        SizedBox(height: 20),
        Text(
          "Transfer learning",
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        SizedBox(height: 16),
        Text("Model to learn on"),
        SizedBox(height: 8),
        Center(
          child: DropdownButton(
            value: _currentLearningOn,
            items: <ModelToLearn>[
              ModelToLearn.DN121,
              ModelToLearn.DN169,
              ModelToLearn.DN201,
              ModelToLearn.INCEPTIONRNV2,
              ModelToLearn.INCEPTIONV3,
              ModelToLearn.MN,
              ModelToLearn.MNV2,
              ModelToLearn.NASNETLARGE,
              ModelToLearn.NASNETMOBILE,
              ModelToLearn.RN50,
              ModelToLearn.RN101,
              ModelToLearn.RN152,
              ModelToLearn.RN101V2,
              ModelToLearn.RN152V2,
              ModelToLearn.RN50V2,
              ModelToLearn.VGG16,
              ModelToLearn.VGG19,
              ModelToLearn.XCEPTION
            ]
                .map((value) => DropdownMenuItem<ModelToLearn>(
                      value: value,
                      child: Text(
                        MlModelMapper.learnToString(value),
                        style: TextStyle(fontSize: 14),
                      ),
                    ))
                .toList(),
            onChanged: (ModelToLearn value) {
              setState(() {
                _currentLearningOn = value;
              });
            },
          ),
        ),
        SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            Text(
              "Layers",
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
            FlatButton.icon(
              icon: Icon(Icons.add),
              label: Text("Add"),
              onPressed: () => _showAddLayersDialog(context),
            ),
          ],
        ),
        SizedBox(height: 8),
        layers != null
            ? Wrap(
                spacing: 8,
                children: layers
                    .map((layer) => Chip(
                          label: Text(MlModelMapper.layerToString(layer.layer) +
                              (layer.args.isNotEmpty
                                  ? " | " + layer.args.map((a) => a).toString()
                                  : "")),
                          deleteIcon: Icon(Icons.cancel),
                          onDeleted: () {
                            Provider.of<ModelTrainBloc>(context)
                                .removeLayer(layer);
                          },
                        ))
                    .toList(),
              )
            : Container(),
        SizedBox(height: 16),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Epochs")),
            Expanded(
                child: LabelTextField(
              keyboardType: TextInputType.number,
              controller: _epochsController,
            )),
          ],
        ),
        SizedBox(height: 8),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Batch Size")),
            Expanded(
                child: LabelTextField(
              keyboardType: TextInputType.number,
              controller: _batchSizeController,
            )),
          ],
        ),
        SizedBox(height: 8),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Learning rate")),
            Expanded(
                child: LabelTextField(
              keyboardType: TextInputType.number,
              controller: _learningRateController,
            )),
          ],
        ),
        SizedBox(height: 16),
        Text("Loss"),
        SizedBox(height: 8),
        Center(
          child: DropdownButton(
            value: _currentLoss,
            items: <ModelLoss>[
              ModelLoss.BCE,
              ModelLoss.CCE,
            ]
                .map((value) => DropdownMenuItem<ModelLoss>(
                      value: value,
                      child: Text(
                        MlModelMapper.lossToString(value),
                        style: TextStyle(fontSize: 14),
                      ),
                    ))
                .toList(),
            onChanged: (ModelLoss value) {
              setState(() {
                _currentLoss = value;
              });
            },
          ),
        ),
        SizedBox(height: 16),
        Text("Optimizer"),
        SizedBox(height: 8),
        Center(
          child: DropdownButton(
            value: _currentOptimizer,
            items: <ModelOptimizer>[
              ModelOptimizer.ADADELTA,
              ModelOptimizer.ADAGRAD,
              ModelOptimizer.ADAM,
              ModelOptimizer.ADAMAX,
              ModelOptimizer.FTRL,
              ModelOptimizer.NADAM,
              ModelOptimizer.RMSPROP,
              ModelOptimizer.SGD,
            ]
                .map((value) => DropdownMenuItem<ModelOptimizer>(
                      value: value,
                      child: Text(
                        MlModelMapper.optimizerToString(value),
                        style: TextStyle(fontSize: 14),
                      ),
                    ))
                .toList(),
            onChanged: (ModelOptimizer value) {
              setState(() {
                _currentOptimizer = value;
              });
            },
          ),
        ),
        SizedBox(height: 16),
        Text("Metric"),
        SizedBox(height: 8),
        Center(
          child: DropdownButton(
            value: _currentMetric,
            items: <ModelMetric>[
              ModelMetric.ACCURACY,
            ]
                .map((value) => DropdownMenuItem<ModelMetric>(
                      value: value,
                      child: Text(
                        MlModelMapper.metricToString(value),
                        style: TextStyle(fontSize: 14),
                      ),
                    ))
                .toList(),
            onChanged: (ModelMetric value) {
              setState(() {
                _currentMetric = value;
              });
            },
          ),
        ),
      ],
    );
  }

  Widget _buildTrainButton() {
    return Row(
      children: <Widget>[
        Expanded(
          child: FlatButton(
            child: Text(
              "Train",
              style: TextStyle(color: Colors.white),
            ),
            color: Theme.of(context).accentColor,
            onPressed: _trainModel,
          ),
        ),
      ],
    );
  }

  void _showAddClassDialog(BuildContext baseContext, List<Label> labels) {
    showDialog<String>(
        context: baseContext,
        builder: (context) {
          return AddClassDialog(labels);
        }).then((String labelId) {
      if (labelId != null)
        Provider.of<ModelTrainBloc>(context).addClass(labelId);
    });
  }

  void _showAddStepsDialog(BuildContext baseContext) {
    showDialog<StepDto>(
        context: baseContext,
        builder: (context) {
          return AddStepDialog();
        }).then((StepDto step) {
      if (step != null) Provider.of<ModelTrainBloc>(context).addStep(step);
    });
  }

  void _showAddLayersDialog(BuildContext baseContext) {
    showDialog<LayerDto>(
        context: baseContext,
        builder: (context) {
          return AddLayerDialog();
        }).then((LayerDto layer) {
      if (layer != null) Provider.of<ModelTrainBloc>(context).addLayer(layer);
    });
  }

  void _trainModel() {
    ModelDto model = ModelDto(
      train: _trainController.text,
      validation: _validationController.text,
      test: _testController.text,
      modelToLearn: _currentLearningOn,
      epochs: _epochsController.text,
      batchSize: _batchSizeController.text,
      learningRate: _learningRateController.text,
      loss: _currentLoss,
      optimizer: _currentOptimizer,
      metric: _currentMetric,
    );

    Provider.of<ModelTrainBloc>(context).trainModel(model);
  }
}
