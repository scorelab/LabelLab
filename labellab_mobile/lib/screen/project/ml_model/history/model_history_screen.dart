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
            ModelHistoryState _state = snapshot.data;
            if (_state.isLoading)
              return _buildLoadingBody(context);
            else
              return _buildBody(_state.models);
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

  Widget _buildBody(List<MlModel> models) {
    return models != null
        ? SingleChildScrollView(
            child: Column(
              children: models
                  .map((model) => Container(
                        margin: EdgeInsets.symmetric(vertical: 8),
                        child: Column(
                          children: <Widget>[
                            Text(model.name),
                          ],
                        ),
                      ))
                  .toList(),
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
