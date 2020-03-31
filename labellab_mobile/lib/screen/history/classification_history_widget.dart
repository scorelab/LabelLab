import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/history/classification_history_bloc.dart';
import 'package:labellab_mobile/screen/history/classification_history_item.dart';
import 'package:labellab_mobile/screen/history/classification_history_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:labellab_mobile/widgets/empty_placeholder.dart';
import 'package:provider/provider.dart';

class ClassificationHistoryWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: Provider.of<ClassificationHistoryBloc>(context).classifications,
      initialData: ClassificationHistoryState.loading(),
      builder: (context, AsyncSnapshot<ClassificationHistoryState> snapshot) {
        final ClassificationHistoryState state = snapshot.data;
        if (state.classifications != null &&
            state.classifications.isNotEmpty) {
          return RefreshIndicator(
            onRefresh: () async {
              Provider.of<ClassificationHistoryBloc>(context).refresh();
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
                      .map((classification) => ClassificationHistoryItem(
                    classification,
                    onDeleteSelected: () {
                      _showOnClassificationDeleteAlert(
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
          return EmptyPlaceholder(
            description: "Your past classifications will appear here",
          );
        }
      },
    );
  }


  void _showOnClassificationDeleteAlert(
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
            Provider.of<ClassificationHistoryBloc>(baseContext).delete(classification.id);
            Navigator.pop(context);
          },
        );
      },
    );
  }

  void _gotoClassification(BuildContext context, String id) {
    Application.router.navigateTo(context, "/classification/$id").then((_) {
      Provider.of<ClassificationHistoryBloc>(context).refresh();
    });
  }

}
