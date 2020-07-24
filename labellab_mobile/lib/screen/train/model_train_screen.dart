import 'package:flutter/material.dart';
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
  String dropdownValue = "1";
  String adamaxValue = "1";
  String accuracyValue = "1";

  List<String> _crossEntropyValues = ["1", "2"];
  List<String> _adamaxValues = ["1", "2"];
  List<String> _accuracyValues = ["1", "2"];

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
            if (_state.isInitial)
              return _buildPreTrainBody();
            else if (_state.isLoading)
              return _buildLoadingBody();
            else if (_state.isTrainingSuccess)
              return _buildPostTrainBody(_state.results);
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
            Text("Epochs"),
            SizedBox(height: 10),
            LabelTextFormField(),
            SizedBox(height: 24),
            Text("Batch Size"),
            SizedBox(height: 10),
            LabelTextFormField(),
            SizedBox(height: 24),
            Text("Learning Rate"),
            SizedBox(height: 10),
            LabelTextFormField(),
            SizedBox(height: 24),
            Text("Categorical Cross Entropy"),
            SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                DropdownButton(
                  value: dropdownValue,
                  elevation: 8,
                  onChanged: (String value) {
                    setState(() {
                      dropdownValue = value;
                    });
                  },
                  items: _crossEntropyValues
                      .map((String value) => DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          ))
                      .toList(),
                ),
              ],
            ),
            SizedBox(height: 24),
            Text("Adamax"),
            SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                DropdownButton(
                  value: adamaxValue,
                  elevation: 8,
                  onChanged: (String value) {
                    setState(() {
                      adamaxValue = value;
                    });
                  },
                  items: _adamaxValues
                      .map((String value) => DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          ))
                      .toList(),
                ),
              ],
            ),
            SizedBox(height: 24),
            Text("Accuracy"),
            SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                DropdownButton(
                  value: accuracyValue,
                  elevation: 8,
                  onChanged: (String value) {
                    setState(() {
                      accuracyValue = value;
                    });
                  },
                  items: _accuracyValues
                      .map((String value) => DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          ))
                      .toList(),
                ),
              ],
            ),
            SizedBox(height: 24),
            Row(
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
            ),
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

  void _trainModel() {
    Provider.of<ModelTrainBloc>(context).initTrain();
  }

  void _saveChanges() {}
}
