import 'dart:math';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_selection.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_bloc.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_state.dart';
import 'package:labellab_mobile/widgets/label_icon_button.dart';
import 'package:provider/provider.dart';

class LabelToolScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        title: Text(""),
      ),
      body: StreamBuilder<LabelToolState>(
        initialData: LabelToolState.initial(),
        stream: Provider.of<LabelToolBloc>(context).state,
        builder: (context, AsyncSnapshot<LabelToolState> snapshot) {
          final LabelToolState _state = snapshot.data;
          return _buildBody(context, _state);
        },
      ),
    );
  }

  Widget _buildBody(BuildContext context, LabelToolState state) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        state.isLoading ? LinearProgressIndicator() : Container(),
        _buildSelections(context, state.selections),
        Expanded(
          child: GestureDetector(
            child: Container(
              decoration: new BoxDecoration(
                image: state.image != null
                    ? DecorationImage(
                        image: CachedNetworkImageProvider(state.image.imageUrl))
                    : null,
              ),
              child: CustomPaint(
                size: Size.infinite,
                painter: Painter(state.selections, state.currentSelection),
              ),
            ),
            onPanStart: state.currentSelection != null &&
                    state.currentSelection.label.type == LabelType.RECTANGLE
                ? (event) {
                    Provider.of<LabelToolBloc>(context).startCurrentSelection(
                      Point(event.localPosition.dx, event.localPosition.dy),
                    );
                  }
                : null,
            onPanUpdate: state.currentSelection != null &&
                    state.currentSelection.label.type == LabelType.RECTANGLE
                ? (event) {
                    Provider.of<LabelToolBloc>(context).updateCurrentSelection(
                      Point(event.localPosition.dx, event.localPosition.dy),
                    );
                  }
                : null,
            onTapUp: state.currentSelection != null &&
                    state.currentSelection.label.type == LabelType.POLYGON
                ? (event) {
                    Provider.of<LabelToolBloc>(context)
                        .appendToCurrentSelection(
                      Point(event.localPosition.dx, event.localPosition.dy),
                    );
                  }
                : null,
          ),
        ),
        !state.isLoading
            ? Card(
                color: Theme.of(context).bottomAppBarColor,
                child: Container(
                  height: 64,
                  child: state.currentSelection != null
                      ? _buildDrawTools(
                          context,
                          state.currentSelection.label.type ==
                                  LabelType.POLYGON &&
                              state.currentSelection.points.length > 0)
                      : _buildMainActions(context, state),
                ),
              )
            : Container(),
      ],
    );
  }

  Widget _buildSelections(
      BuildContext context, List<LabelSelection> selections) {
    if (selections.length > 0) {
      return Container(
        alignment: Alignment.centerLeft,
        height: 54,
        padding: EdgeInsets.only(right: 8),
        child: ListView(
          scrollDirection: Axis.horizontal,
          children: selections.map((selection) {
            return Padding(
              padding: const EdgeInsets.only(left: 8.0),
              child: Chip(
                label: Text(selection.label.name),
                backgroundColor: selection.color,
                deleteIcon: Icon(Icons.cancel),
                onDeleted: () {
                  Provider.of<LabelToolBloc>(context)
                      .removeSelection(selection);
                },
              ),
            );
          }).toList(),
        ),
      );
    } else {
      return Container(
        height: 54,
      );
    }
  }

  Widget _buildMainActions(BuildContext context, LabelToolState state) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: <Widget>[
        LabelIconButton(Icons.add, "Add", onTap: () {
          _showLabelSelectionModel(context, state);
        }),
        LabelIconButton(Icons.save, "Save")
      ],
    );
  }

  Widget _buildDrawTools(BuildContext context, isUndoEnable) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: <Widget>[
        LabelIconButton(
          Icons.close,
          "Cancel",
          onTap: () =>
              Provider.of<LabelToolBloc>(context).cancelCurrentSelection(),
        ),
        LabelIconButton(
          Icons.refresh,
          "Reset",
          onTap: () =>
              Provider.of<LabelToolBloc>(context).resetCurrentSelection(),
        ),
        LabelIconButton(
          Icons.undo,
          "Undo",
          onTap: isUndoEnable
              ? () =>
                  Provider.of<LabelToolBloc>(context).undoFromCurrentSelection()
              : null,
        ),
        LabelIconButton(
          Icons.done,
          "Done",
          onTap: () =>
              Provider.of<LabelToolBloc>(context).saveCurrentSelection(),
        ),
      ],
    );
  }

  void _showLabelSelectionModel(
      BuildContext baseContext, LabelToolState state) {
    showModalBottomSheet(
      context: baseContext,
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text("Select label", style: Theme.of(context).textTheme.title),
              SizedBox(
                height: 8,
              ),
              state.labels == null
                  ? LinearProgressIndicator()
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: state.labels.map((label) {
                        return InkWell(
                          child: Chip(label: Text(label.name)),
                          onTap: () {
                            Provider.of<LabelToolBloc>(baseContext)
                                .selectLabel(label);
                            Navigator.pop(context);
                          },
                        );
                      }).toList(),
                    ),
            ],
          ),
        );
      },
    );
  }
}

class Painter extends CustomPainter {
  final List<LabelSelection> labelSelections;
  final LabelSelection current;

  Painter(this.labelSelections, this.current);
  @override
  void paint(Canvas canvas, Size size) {
    for (var labelPoint in labelSelections) {
      drawPath(canvas, labelPoint.color, labelPoint.points,
          withVertices: false);
    }
    if (current != null) {
      drawPath(canvas, Colors.blue, current.points);
    }
  }

  @override
  bool shouldRepaint(Painter oldDelegate) => true;

  void drawPath(Canvas canvas, Color color, List<Point> points,
      {bool withVertices = true}) {
    if (points.length > 0) {
      final paint = Paint();
      final paintStroke = Paint();

      paint.color = color;
      paintStroke.color = color;
      paintStroke.style = PaintingStyle.stroke;
      paintStroke.strokeWidth = 4;

      final path = Path();
      if (withVertices) {
        for (var point in points) {
          canvas.drawCircle(Offset(point.x, point.y), 6, paint);
        }
      }

      path.moveTo(points[0].x, points[0].y);
      for (var point in points) {
        path.lineTo(point.x, point.y);
      }
      path.lineTo(points[0].x, points[0].y);

      canvas.drawPath(path, paintStroke);
    }
  }
}
