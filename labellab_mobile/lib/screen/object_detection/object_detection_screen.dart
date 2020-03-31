import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/widgets.dart';
import 'package:intl/intl.dart';
import 'package:labellab_mobile/model/object_detection.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/object_detection/object_detection_bloc.dart';
import 'package:labellab_mobile/screen/object_detection/object_detection_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:provider/provider.dart';

class ObjectDetectionScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Object Detection"),
        centerTitle: true,
        elevation: 0,
        actions: <Widget>[
          PopupMenuButton<int>(
            onSelected: (selected) {
              if (selected == 0) {
                _showOnDeleteAlert(context);
              }
            },
            itemBuilder: (context) {
              return [
                PopupMenuItem(
                  value: 0,
                  child: Text("Delete"),
                )
              ];
            },
          )
        ],
      ),
      body: StreamBuilder(
        stream: Provider.of<ObjectDetectionBloc>(context).state,
        builder: (context, AsyncSnapshot<ObjectDetectionState> snapshot) {
          if (snapshot.hasData) {
            final ObjectDetectionState state = snapshot.data;
            return ListView(
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
                state.objectDetection != null
                    ? _buildObjectDetection(context, state.objectDetection)
                    : Container(),
              ],
            );
          } else {
            return Text("No data");
          }
        },
      ),
    );
  }

  Widget _buildObjectDetection(
      BuildContext context, ObjectDetection classification) {
    return Column(
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.all(12.0),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Container(
              height: 320,
              color: Colors.black12,
              child: Image(
                image: CachedNetworkImageProvider(classification.imageUrl),
                fit: BoxFit.cover,
              ),
            ),
          ),
        ),
        Text("Labels",style: TextStyle(fontSize: 20),),
        Container(
          height: 80,
          width: MediaQuery.of(context).size.width,
          child: ListView(
            physics: BouncingScrollPhysics(),
            scrollDirection: Axis.horizontal,
            children: classification.detections != null
                ? classification.detections.map((label) {
              return Padding(
                padding: const EdgeInsets.all(8.0),
                child: Container(decoration: BoxDecoration(color: Colors.grey,borderRadius: BorderRadius.circular(8)),
                  padding: EdgeInsets.all(4),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: <Widget>[
                      Text('${label.name} => ${label.confidence.toString()}%'),
                      Text('x1 => ${label.x1}, y1 => ${label.y1}'),
                      Text('x2 => ${label.x2}, y2 => ${label.y2}'),
                    ],
                  ),
                ),
              );
            }).toList()
                : [],
          ),
        ),
        classification.createdAt != null
            ? ListTile(
                title: Text("Classified at"),
                subtitle: Text(
                  DateFormat.yMd().format(classification.createdAt),
                ),
              )
            : Container(),
      ],
    );
  }

  void _showOnDeleteAlert(BuildContext baseContext) {
    showDialog(
        context: baseContext,
        builder: (context) {
          return DeleteConfirmDialog(
            name: "",
            onCancel: () {
              Navigator.pop(context, false);
            },
            onConfirm: () {
              Provider.of<ObjectDetectionBloc>(baseContext).delete();
              Navigator.pop(context, true);
            },
          );
        }).then((isDeleted) {
      if (isDeleted != null && isDeleted) Application.router.pop(baseContext);
    });
  }
}
