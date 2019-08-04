import 'dart:math';

import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_selection.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_bloc.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_state.dart';
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
        Expanded(
          child: GestureDetector(
            child: CustomPaint(
              size: Size.infinite,
              painter: Painter(state.selections, state.currentSelection),
            ),
            onPanStart: (event) {
              Provider.of<LabelToolBloc>(context).startCurrentSelection(
                  Point(event.localPosition.dx, event.localPosition.dy));
            },
            onPanUpdate: (event) {
              Provider.of<LabelToolBloc>(context).updateCurrentSelection(
                  Point(event.localPosition.dx, event.localPosition.dy));
            },
          ),
        ),
        Card(
          color: Theme.of(context).bottomAppBarColor,
          child: Container(
            height: 64,
            child: state.currentSelection != null
                ? _buildDrawRectangleTools(context)
                : _buildMainActions(context),
          ),
        ),
      ],
    );
  }

  Widget _buildMainActions(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: <Widget>[
        IconButton(
            icon: Icon(Icons.add),
            onPressed: () {
              Provider.of<LabelToolBloc>(context).selectLabel(Label(
                id: "Rect",
                name: "Rect",
                type: "Rectangle",
              ));
            }),
        IconButton(
          icon: Icon(Icons.save),
          onPressed: null,
        ),
      ],
    );
  }

  Widget _buildDrawRectangleTools(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: <Widget>[
        IconButton(
          icon: Icon(Icons.close),
          onPressed: () =>
              Provider.of<LabelToolBloc>(context).cancelCurrentSelection(),
        ),
        IconButton(
          icon: Icon(Icons.refresh),
          onPressed: () =>
              Provider.of<LabelToolBloc>(context).resetCurrentSelection(),
        ),
        IconButton(
          icon: Icon(Icons.done),
          onPressed: () =>
              Provider.of<LabelToolBloc>(context).saveCurrentSelection(),
        ),
      ],
    );
  }
}

class Painter extends CustomPainter {
  final List<LabelSelection> labelSelections;
  final LabelSelection current;

  Painter(this.labelSelections, this.current);
  @override
  void paint(Canvas canvas, Size size) {
    if (current != null) {
      drawRectangle(canvas, Colors.blue, current.points);
    }
    for (var labelPoint in labelSelections) {
      drawRectangle(canvas, Colors.grey, labelPoint.points);
    }
  }

  @override
  bool shouldRepaint(Painter oldDelegate) => true;

  void drawRectangle(Canvas canvas, Color color, List<Point> points) {
    if (points.length > 3) {
      final paint = Paint();
      final paintStroke = Paint();

      paint.color = color;
      paintStroke.color = color;
      paintStroke.style = PaintingStyle.stroke;
      paintStroke.strokeWidth = 5;

      for (var point in points) {
        canvas.drawCircle(Offset(point.x, point.y), 10, paint);
      }
      var rect = Rect.fromLTWH(points[0].x, points[0].y,
          points[3].x - points[0].x, points[3].y - points[0].y);

      canvas.drawRect(rect, paintStroke);
    }
  }
}
