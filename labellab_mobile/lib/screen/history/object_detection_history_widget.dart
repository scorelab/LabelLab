import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/object_detection.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/history/object_detection_history_bloc.dart';
import 'package:labellab_mobile/screen/history/object_detection_history_item.dart';
import 'package:labellab_mobile/screen/history/object_detection_history_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:labellab_mobile/widgets/empty_placeholder.dart';
import 'package:provider/provider.dart';

class ObjectDetectionHistoryWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: Provider.of<ObjectDetectionHistoryBloc>(context).objectDetections,
      initialData: ObjectDetectionHistoryState.loading(),
      builder: (context, AsyncSnapshot<ObjectDetectionHistoryState> snapshot) {
        final ObjectDetectionHistoryState state = snapshot.data;
        if (state.objectDetections != null &&
            state.objectDetections.isNotEmpty) {
          return RefreshIndicator(
            onRefresh: () async {
              Provider.of<ObjectDetectionHistoryBloc>(context).refresh();
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
                state.objectDetections != null
                    ? Column(
                  children: state.objectDetections
                      .map((objectDetection) => ObjectDetectionHistoryItem(
                    objectDetection,
                    onDeleteSelected: () {
                      _showOnObjectDetectionDeleteAlert(
                          context, objectDetection);
                    },
                    onSelected: () => _gotoObjectDetection(
                        context, objectDetection.id),
                  ))
                      .toList(),
                )
                    : Container(),
              ],
            ),
          );
        } else {
          return EmptyPlaceholder(
            description: "Your past Object Detections will appear here",
          );
        }
      },
    );
  }

  void _showOnObjectDetectionDeleteAlert(
      BuildContext baseContext, ObjectDetection objectDetection) {
    showDialog(
      context: baseContext,
      builder: (context) {
        return DeleteConfirmDialog(
          name: "",
          onCancel: () {
            Navigator.pop(context);
          },
          onConfirm: () {
            Provider.of<ObjectDetectionHistoryBloc>(baseContext).delete(objectDetection.id);
            Navigator.pop(context);
          },
        );
      },
    );
  }


  void _gotoObjectDetection(BuildContext context, String id) {
    Application.router.navigateTo(context, "/objectDetection/$id").then((_) {
      Provider.of<ObjectDetectionHistoryBloc>(context).refresh();
    });
  }

}

