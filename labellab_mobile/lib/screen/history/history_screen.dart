import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/history/classification_history_bloc.dart';
import 'package:labellab_mobile/screen/history/classification_history_widget.dart';
import 'package:labellab_mobile/screen/history/object_detection_history_bloc.dart';
import 'package:labellab_mobile/screen/history/object_detection_history_widget.dart';
import 'package:provider/provider.dart';

class HistoryScreen extends StatefulWidget {
  @override
  _HistoryScreenState createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  bool classification = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("History"),
        centerTitle: true,
        elevation: 0,
        actions: <Widget>[
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right:8.0),
              child: OutlineButton(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(50)),
                  child: Text(
                      classification ? 'Classifications' : 'Object Detections'),
                  onPressed: () {
                    setState(() {
                      classification = !classification;
                    });
                  }),
            ),
          )
        ],
      ),
      body: classification
          ? Provider<ClassificationHistoryBloc>(
              builder: (context) => ClassificationHistoryBloc(),
              dispose: (context, bloc) => bloc.dispose(),
              child: ClassificationHistoryWidget(),
            )
          : Provider<ObjectDetectionHistoryBloc>(
              builder: (context) => ObjectDetectionHistoryBloc(),
              dispose: (context, bloc) => bloc.dispose(),
              child: ObjectDetectionHistoryWidget(),
            ),
    );
  }
}
