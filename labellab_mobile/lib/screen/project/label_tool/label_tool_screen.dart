import 'dart:math';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/image.dart' as LabelLab;
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/label_selection.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_bloc.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_state.dart';
import 'package:labellab_mobile/util/util.dart';
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
          if (snapshot.data.isSuccess) {
            WidgetsBinding.instance
                .addPostFrameCallback((_) => Application.router.pop(context));
          }
          return _buildBody(context, _state);
        },
      ),
    );
  }

  Widget _buildBody(BuildContext context, LabelToolState state) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        state.isLoading || state.isSaving
            ? LinearProgressIndicator()
            : Container(),
        _buildSelections(context, state.selections),
        state.image != null
            ? Expanded(
                child: GestureDetector(
                  child: Container(
                    decoration: new BoxDecoration(
                      image: state.image != null
                          ? DecorationImage(
                              image: CachedNetworkImageProvider(
                                  state.image.imageUrl))
                          : null,
                    ),
                    child: CustomPaint(
                      size: Size.infinite,
                      painter: Painter(
                          state.selections, state.currentSelection, state.image,
                          sizeCallback: (Size size) {
                        final SelectionOffset offset =
                            calculateImageOffset(state.image, size);
                        Provider.of<LabelToolBloc>(context)
                            .setCanvasSelectionOffset(offset);
                      }),
                    ),
                  ),
                  onPanStart: state.currentSelection != null &&
                          state.currentSelection.label.type ==
                              LabelType.RECTANGLE
                      ? (event) {
                          Provider.of<LabelToolBloc>(context)
                              .startCurrentSelection(
                            Point(
                                event.localPosition.dx, event.localPosition.dy),
                          );
                        }
                      : null,
                  onPanUpdate: state.currentSelection != null &&
                          state.currentSelection.label.type ==
                              LabelType.RECTANGLE
                      ? (event) {
                          Provider.of<LabelToolBloc>(context)
                              .updateCurrentSelection(
                            Point(
                                event.localPosition.dx, event.localPosition.dy),
                          );
                        }
                      : null,
                  onTapUp: state.currentSelection != null &&
                          state.currentSelection.label.type == LabelType.POLYGON
                      ? (event) {
                          Provider.of<LabelToolBloc>(context)
                              .appendToCurrentSelection(
                            Point(
                                event.localPosition.dx, event.localPosition.dy),
                          );
                        }
                      : null,
                ),
              )
            : Expanded(
                child: Container(),
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
        LabelIconButton(
          Icons.add,
          "Add",
          onTap: !state.isSaving
              ? () {
                  _showLabelSelectionModel(context, state);
                }
              : null,
        ),
        LabelIconButton(
          Icons.save,
          "Save",
          onTap: () {
            Provider.of<LabelToolBloc>(context).uploadSelections();
          },
        )
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

typedef void SizeCallback(Size size);

class Painter extends CustomPainter {
  final List<LabelSelection> labelSelections;
  final LabelSelection current;
  final LabelLab.Image image;
  final SizeCallback sizeCallback;
  Size _size;

  Painter(this.labelSelections, this.current, this.image, {this.sizeCallback});

  @override
  void paint(Canvas canvas, Size size) {
    if (sizeCallback != null) {
      if (_size == null || _size != size) {
        _size = size;
        sizeCallback(_size);
      }
    }

    final SelectionOffset selectionOffset = calculateImageOffset(image, size);

    for (var labelSelection in labelSelections) {
      drawPath(canvas, labelSelection.color, labelSelection.points,
          offset: labelSelection.isAdjusted
              ? selectionOffset
              : SelectionOffset.zero,
          withVertices: false);
    }
    if (current != null) {
      drawPath(canvas, Colors.blue, current.points);
    }
  }

  @override
  bool shouldRepaint(Painter oldDelegate) => true;

  void drawPath(Canvas canvas, Color color, List<Point> points,
      {SelectionOffset offset = SelectionOffset.zero,
      bool withVertices = true}) {
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
          canvas.drawCircle(
              Offset(point.x / offset.scale + offset.dx,
                  point.y / offset.scale + offset.dy),
              6,
              paint);
        }
      }

      path.moveTo(points[0].x / offset.scale + offset.dx,
          points[0].y / offset.scale + offset.dy);
      for (var point in points) {
        path.lineTo(point.x / offset.scale + offset.dx,
            point.y / offset.scale + offset.dy);
      }
      path.lineTo(points[0].x / offset.scale + offset.dx,
          points[0].y / offset.scale + offset.dy);

      canvas.drawPath(path, paintStroke);
    }
  }
}
