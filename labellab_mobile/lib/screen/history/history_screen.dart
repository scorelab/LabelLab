import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/history/history_bloc.dart';
import 'package:labellab_mobile/screen/history/history_item.dart';
import 'package:labellab_mobile/screen/history/history_search_screen.dart';
import 'package:labellab_mobile/screen/history/history_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:labellab_mobile/widgets/empty_placeholder.dart';
import 'package:provider/provider.dart';

class HistoryScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: Provider.of<HistoryBloc>(context).classifications,
      initialData: HistoryState.loading(),
      builder: (context, AsyncSnapshot<HistoryState> snapshot) {
        final HistoryState state = snapshot.data!;
        if (state.classifications != null &&
            state.classifications!.isNotEmpty) {
          return Scaffold(
            appBar: AppBar(
              title: Text("History"),
              centerTitle: true,
              elevation: 0,
              actions: <Widget>[
                IconButton(
                    icon: Icon(Icons.search),
                    onPressed: () {
                      _gotoHistorySearch(context, state);
                    })
              ],
            ),
            body: RefreshIndicator(
              onRefresh: () async {
                Provider.of<HistoryBloc>(context, listen: false).refresh();
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
                          title: Text(state.error!),
                        )
                      : Container(),
                  state.classifications != null
                      ? Column(
                          children: state.classifications!
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
            ),
          );
        } else {
          return Scaffold(
            appBar: AppBar(
              title: Text("History"),
              centerTitle: true,
              elevation: 0,
            ),
            body: EmptyPlaceholder(
              description: "Your past classifications will appear here",
            ),
          );
        }
      },
    );
  }

  void _showOnDeleteAlert(
      BuildContext baseContext, Classification classification) {
    showDialog(
      context: baseContext,
      builder: (context) {
        return DeleteConfirmDialog(
          name: "",
          onCancel: () {
            Navigator.pop(context);
          },
          onConfirm: () {
            Provider.of<HistoryBloc>(baseContext, listen: false)
                .delete(classification.id);
            Navigator.pop(context);
          },
        );
      },
    );
  }

  void _gotoClassification(BuildContext context, String? id) {
    Application.router.navigateTo(context, "/classification/$id").then((_) {
      Provider.of<HistoryBloc>(context, listen: false).refresh();
    });
  }

  void _gotoHistorySearch(BuildContext context, HistoryState historyState) {
    showSearch(context: context, delegate: HistorySearchScreen(historyState));
  }
}
