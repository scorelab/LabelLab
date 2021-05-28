import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/history/history_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:labellab_mobile/widgets/empty_placeholder.dart';
import 'package:provider/provider.dart';

import 'history_bloc.dart';
import 'history_item.dart';

class HistorySearchScreen extends SearchDelegate {
  HistoryState state;

  HistorySearchScreen(this.state);

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: AnimatedIcon(
          icon: AnimatedIcons.menu_close,
          progress: transitionAnimation,
        ),
        onPressed: () {
          query = '';
        },
      )
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: Icon(Icons.arrow_back),
      onPressed: () {
        Navigator.of(context).pop();
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    return state.classifications != null && state.classifications!.isNotEmpty
        ? ListView(
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
                          .where((classification) {
                            bool found = false;
                            classification.labels!.forEach((label) {
                              if (label.name!
                                  .toLowerCase()
                                  .contains(query.toLowerCase())) {
                                found = true;
                              }
                            });
                            return found;
                          })
                          .map((classification) => HistoryItem(
                                classification,
                                onSelected: () => _gotoClassification(
                                    context, classification.id),
                              ))
                          .toList(),
                    )
                  : Container(),
            ],
          )
        : EmptyPlaceholder(
            description: "Your past classifications will appear here",
          );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    return state.classifications != null && state.classifications!.isNotEmpty
        ? ListView(
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
                          .where((classification) {
                            bool found = false;
                            classification.labels!.forEach((label) {
                              if (label.name!
                                  .toLowerCase()
                                  .contains(query.toLowerCase())) {
                                found = true;
                              }
                            });
                            return found;
                          })
                          .map((classification) => HistoryItem(
                                classification,
                                onDeleteSelected: () {
                                  _showOnDeleteAlert(context, classification);
                                },
                                onSelected: () => _gotoClassification(
                                    context, classification.id),
                                shouldHaveOptions: false,
                              ))
                          .toList(),
                    )
                  : Container(),
            ],
          )
        : EmptyPlaceholder(
            description: "Your past classifications will appear here",
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
            Provider.of<HistoryBloc>(baseContext).delete(classification.id);
            Navigator.pop(context);
          },
        );
      },
    );
  }

  void _gotoClassification(BuildContext context, String? id) {
    Application.router.navigateTo(context, "/classification/$id").then((_) {
      Provider.of<HistoryBloc>(context).refresh();
    });
  }
}
