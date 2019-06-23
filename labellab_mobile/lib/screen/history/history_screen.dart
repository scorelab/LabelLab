import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/history/history_bloc.dart';
import 'package:labellab_mobile/screen/history/history_item.dart';
import 'package:labellab_mobile/screen/history/history_state.dart';
import 'package:provider/provider.dart';

class HistoryScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("History"),
        centerTitle: true,
        elevation: 2,
      ),
      body: StreamBuilder(
        stream: Provider.of<HistoryBloc>(context).classifications,
        builder: (context, AsyncSnapshot<HistoryState> snapshot) {
          if (snapshot.hasData) {
            final HistoryState state = snapshot.data;
            return RefreshIndicator(
              onRefresh: () async {
                Provider.of<HistoryBloc>(context).refresh();
              },
              child: ListView(
                children: <Widget>[
                  state.isLoading
                      ? LinearProgressIndicator(
                          backgroundColor: Theme.of(context).canvasColor,
                        )
                      : Container(
                          height: 6,
                        ),
                  state.error != null
                      ? ListTile(
                          title: Text(state.error),
                        )
                      : Container(),
                  state.classifications != null
                      ? Column(
                          children: state.classifications
                              .map((classification) => HistoryItem(
                                    classification,
                                    onDeleteSelected: () {
                                      _showOnDeleteAlert(
                                          context, classification);
                                    },
                                    onSelected: () => _gotoClassification(
                                        context, classification.id),
                                  ))
                              .toList(),
                        )
                      : Container(),
                ],
              ),
            );
          } else {
            return Text("No data");
          }
        },
      ),
    );
  }

  void _showOnDeleteAlert(
      BuildContext baseContext, Classification classification) {
    showDialog(
        context: baseContext,
        builder: (context) {
          return AlertDialog(
            title: Text("Delete"),
            content: Text("Are you sure?"),
            actions: <Widget>[
              ButtonBar(
                children: <Widget>[
                  FlatButton(
                    child: Text("No"),
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                  FlatButton(
                    child: Text("Yes"),
                    onPressed: () {
                      Provider.of<HistoryBloc>(baseContext)
                          .delete(classification.id);
                      Navigator.pop(context);
                    },
                  ),
                ],
              )
            ],
          );
        });
  }

  void _gotoClassification(BuildContext context, String id) {
    Application.router.navigateTo(context, "/classification/$id");
  }
}
