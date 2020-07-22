import 'package:flutter/material.dart';
import 'package:labellab_mobile/widgets/label_text_form_field.dart';

class ModelTrainScreen extends StatefulWidget {
  @override
  _ModelTrainScreenState createState() => _ModelTrainScreenState();
}

class _ModelTrainScreenState extends State<ModelTrainScreen> {
  String dropdownValue = "1";

  List<String> _crossEntropyValues = ["1", "2"];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Train model"),
        elevation: 0,
      ),
      body: SingleChildScrollView(
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
              Text("Accuracy"),
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
      ),
    );
  }

  void _trainModel() {}
}
