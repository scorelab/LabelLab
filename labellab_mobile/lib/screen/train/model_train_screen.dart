import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/mapper/ml_model_mapper.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/screen/train/model_train_bloc.dart';
import 'package:labellab_mobile/screen/train/model_train_state.dart';
import 'package:labellab_mobile/widgets/label_text_form_field.dart';
import 'package:labellab_mobile/widgets/line_chart.dart';
import 'package:provider/provider.dart';
import 'package:charts_flutter/flutter.dart' as charts;

class ModelTrainScreen extends StatefulWidget {
  @override
  _ModelTrainScreenState createState() => _ModelTrainScreenState();
}

class _ModelTrainScreenState extends State<ModelTrainScreen> {
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
              return _buildPreTrainBody();
          }
          return Container();
        },
      ),
    );
  }

  SingleChildScrollView _buildPreTrainBody() {
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
            SizedBox(height: 16),
            _buildAddClassButton(),
            SizedBox(height: 16),
            Text(
              "Train",
              style: Theme.of(context).textTheme.headline6,
            ),
            SizedBox(height: 16),
            _buildTrainBody(),
            SizedBox(height: 24),
            _buildTrainButton(),
            SizedBox(height: 24)
          ],
        ),
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

  Widget _buildPostTrainBody(List<charts.Series> results) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Text("Loss Curve"),
          SizedBox(height: 20),
          Expanded(child: SimpleTimeSeriesChart(results)),
          SizedBox(height: 20),
          Text("Accuracy Curve"),
          SizedBox(height: 20),
          Expanded(child: SimpleTimeSeriesChart(results)),
          SizedBox(height: 80),
          FlatButton(
            child: Text(
              "Save Changes",
              style: TextStyle(color: Colors.white),
            ),
            color: Theme.of(context).accentColor,
            onPressed: _saveChanges,
          ),
          SizedBox(height: 20),
        ],
      ),
    );
  }

  void _trainModel() {}

  void _saveChanges() {}

  Widget _buildAddClassButton() {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 8),
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
      ),
    );
  }

  Widget _buildTrainBody() {
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
              // onPressed: () => _showAddEditModelPrompt(context),
            ),
          ],
        ),
        SizedBox(height: 8),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Train")),
            Expanded(child: LabelTextFormField()),
          ],
        ),
        SizedBox(height: 8),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Validation")),
            Expanded(child: LabelTextFormField()),
          ],
        ),
        SizedBox(height: 8),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Test")),
            Expanded(child: LabelTextFormField()),
          ],
        ),
        SizedBox(height: 16),
        Text(
          "Transfer learning",
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        SizedBox(height: 16),
        Text("Model to learn on"),
        SizedBox(height: 8),
        Center(
          child: DropdownButton(
            // value: _currentSource,
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
                      child: Text(MlModelMapper.learnToString(value)),
                    ))
                .toList(),
            onChanged: (ModelToLearn value) {
              setState(() {
                // _currentSource = value;
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
              // onPressed: () => _showAddEditModelPrompt(context),
            ),
          ],
        ),
        SizedBox(height: 8),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Epochs")),
            Expanded(child: LabelTextFormField()),
          ],
        ),
        SizedBox(height: 8),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Batch Size")),
            Expanded(child: LabelTextFormField()),
          ],
        ),
        SizedBox(height: 8),
        Row(
          children: <Widget>[
            Container(width: 100, child: Text("Learning rate")),
            Expanded(child: LabelTextFormField()),
          ],
        ),
        SizedBox(height: 16),
        Text("Loss"),
        SizedBox(height: 8),
        Center(
          child: DropdownButton(
            // value: _currentSource,
            items: <ModelLoss>[
              ModelLoss.BCE,
              ModelLoss.CCE,
            ]
                .map((value) => DropdownMenuItem<ModelLoss>(
                      value: value,
                      child: Text(MlModelMapper.lossToString(value)),
                    ))
                .toList(),
            onChanged: (ModelLoss value) {
              setState(() {
                // _currentSource = value;
              });
            },
          ),
        ),
        SizedBox(height: 16),
        Text("Optimizer"),
        SizedBox(height: 8),
        Center(
          child: DropdownButton(
            // value: _currentSource,
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
                      child: Text(MlModelMapper.optimizerToString(value)),
                    ))
                .toList(),
            onChanged: (ModelOptimizer value) {
              setState(() {
                // _currentSource = value;
              });
            },
          ),
        ),
        SizedBox(height: 16),
        Text("Metric"),
        SizedBox(height: 8),
        Center(
          child: DropdownButton(
            // value: _currentSource,
            items: <ModelMetric>[
              ModelMetric.ACCURACY,
            ]
                .map((value) => DropdownMenuItem<ModelMetric>(
                      value: value,
                      child: Text(MlModelMapper.metricToString(value)),
                    ))
                .toList(),
            onChanged: (ModelMetric value) {
              setState(() {
                // _currentSource = value;
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
}
