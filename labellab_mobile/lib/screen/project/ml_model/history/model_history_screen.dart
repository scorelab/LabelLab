import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/screen/project/ml_model/history/model_history_bloc.dart';
import 'package:labellab_mobile/screen/project/ml_model/history/model_history_state.dart';
import 'package:provider/provider.dart';

class ModelHistoryScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Model History"),
        elevation: 0,
      ),
      body: StreamBuilder<ModelHistoryState>(
        stream: Provider.of<ModelHistoryBloc>(context).state,
        initialData: ModelHistoryState.loading(),
        builder:
            (BuildContext context, AsyncSnapshot<ModelHistoryState> snapshot) {
          if (snapshot.hasData) {
            ModelHistoryState _state = snapshot.data!;
            if (_state.isLoading)
              return _buildLoadingBody(context);
            else
              return _buildBody(context, _state.models);
          }
          return Container();
        },
      ),
    );
  }

  Widget _buildLoadingBody(BuildContext context) {
    return Container(
      child: LinearProgressIndicator(
        backgroundColor: Theme.of(context).canvasColor,
      ),
    );
  }

  Widget _buildBody(BuildContext context, List<MlModel>? models) {
    return models != null
        ? Container(
            margin: EdgeInsets.symmetric(horizontal: 16),
            child: SingleChildScrollView(
              child: Column(
                children: models
                    .map((model) => Container(
                          margin: EdgeInsets.symmetric(vertical: 8),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                                color: Theme.of(context).accentColor),
                          ),
                          child: Container(
                            margin: EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: <Widget>[
                                Text(
                                  model.name!,
                                  style: TextStyle(
                                    fontSize: 18,
                                  ),
                                ),
                                SizedBox(height: 16),
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: <Widget>[
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Text(
                                          "Train",
                                          style: TextStyle(fontSize: 12),
                                        ),
                                        SizedBox(height: 8),
                                        Text(
                                          model.train.toString(),
                                          style: TextStyle(
                                            fontWeight: FontWeight.w700,
                                          ),
                                        )
                                      ],
                                    ),
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.end,
                                      children: <Widget>[
                                        Text(
                                          "Test",
                                          style: TextStyle(fontSize: 12),
                                        ),
                                        SizedBox(height: 8),
                                        Text(
                                          model.test.toString(),
                                          style: TextStyle(
                                            fontWeight: FontWeight.w700,
                                          ),
                                        )
                                      ],
                                    ),
                                  ],
                                ),
                                SizedBox(height: 16),
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: <Widget>[
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Text(
                                          "Validation",
                                          style: TextStyle(fontSize: 12),
                                        ),
                                        SizedBox(height: 8),
                                        Text(
                                          model.validation.toString(),
                                          style: TextStyle(
                                            fontWeight: FontWeight.w700,
                                          ),
                                        )
                                      ],
                                    ),
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.end,
                                      children: <Widget>[
                                        Text(
                                          "Epochs",
                                          style: TextStyle(fontSize: 12),
                                        ),
                                        SizedBox(height: 8),
                                        Text(
                                          model.epochs.toString(),
                                          style: TextStyle(
                                            fontWeight: FontWeight.w700,
                                          ),
                                        )
                                      ],
                                    ),
                                  ],
                                ),
                                SizedBox(height: 16),
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: <Widget>[
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Text(
                                          "Batch Size",
                                          style: TextStyle(fontSize: 12),
                                        ),
                                        SizedBox(height: 8),
                                        Text(
                                          model.batchSize.toString(),
                                          style: TextStyle(
                                            fontWeight: FontWeight.w700,
                                          ),
                                        )
                                      ],
                                    ),
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.end,
                                      children: <Widget>[
                                        Text(
                                          "Learning Rate",
                                          style: TextStyle(fontSize: 12),
                                        ),
                                        SizedBox(height: 8),
                                        Text(
                                          model.learningRate.toString(),
                                          style: TextStyle(
                                            fontWeight: FontWeight.w700,
                                          ),
                                        )
                                      ],
                                    ),
                                  ],
                                ),
                                SizedBox(height: 16),
                                Text(
                                  "Loss Graph",
                                  style: TextStyle(fontSize: 12),
                                ),
                                SizedBox(height: 8),
                                Container(
                                  height: 200,
                                  decoration: BoxDecoration(
                                    image: DecorationImage(
                                      image: NetworkImage(model.lossGraphUrl!),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                SizedBox(height: 16),
                                Text(
                                  "Accuracy Graph",
                                  style: TextStyle(fontSize: 12),
                                ),
                                SizedBox(height: 8),
                                Container(
                                  height: 200,
                                  decoration: BoxDecoration(
                                    image: DecorationImage(
                                      image:
                                          NetworkImage(model.accuracyGraphUrl!),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                )
                              ],
                            ),
                          ),
                        ))
                    .toList(),
              ),
            ),
          )
        : Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Icon(
                  Icons.error,
                  size: 28,
                  color: Colors.black45,
                ),
                SizedBox(
                  width: 8,
                ),
                Text(
                  "Not enough data to generate",
                  style: TextStyle(color: Colors.black45),
                ),
              ],
            ),
          );
  }
}
