import 'dart:math';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/add_edit_label/add_edit_label_dialog.dart';
import 'package:labellab_mobile/screen/project/common/label_selection_list.dart';
import 'package:labellab_mobile/screen/project/common/label_selection_painter.dart';
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
        LabelSelectionList(
          state.selections,
          true,
          onTap: (selection) {
            !state.isUpdating
                ? Provider.of<LabelToolBloc>(context).updateSelection(selection)
                : null;
          },
          onDeleted: (selection) {
            Provider.of<LabelToolBloc>(context).removeSelection(selection);
          },
        ),
        state.image != null
            ? _buildDrawingTool(context, state)
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
                              state.currentSelection.points.length > 0,
                          state.isUpdating)
                      : _buildMainActions(context, state),
                ),
              )
            : Container(),
      ],
    );
  }

  Widget _buildDrawingTool(BuildContext context, LabelToolState state) {
    return Expanded(
      child: Stack(
        children: <Widget>[
          GestureDetector(
            child: Container(
              decoration: new BoxDecoration(
                image: state.image != null
                    ? DecorationImage(
                        image: CachedNetworkImageProvider(state.image.imageUrl),
                      )
                    : null,
              ),
              child: CustomPaint(
                size: Size.infinite,
                painter: LabelSelectionPainter(
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
          state.currentSelection != null
              ? Positioned(
                  left: 16,
                  bottom: 0,
                  child: Row(
                    children: <Widget>[
                      state.isUpdating
                          ? Text(
                              "Updating\t\t",
                              style: TextStyle(fontWeight: FontWeight.w700),
                            )
                          : Container(),
                      Chip(
                        backgroundColor: Colors.blue,
                        label: Text(
                          state.currentSelection.label.name,
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                      SizedBox(
                        width: 8,
                      ),
                      !state.isUpdating
                          ? Text(
                              state.currentSelection.label.type ==
                                      LabelType.POLYGON
                                  ? "Tap to draw a polygon"
                                  : "Touch and drag to draw a rectangle",
                              style: TextStyle(color: Colors.black45),
                            )
                          : Container(),
                    ],
                  ),
                )
              : Container(),
        ],
      ),
    );
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

  Widget _buildDrawTools(BuildContext context, isUndoEnable, isUpdating) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: <Widget>[
        LabelIconButton(
          Icons.close,
          "Cancel",
          onTap: () => isUpdating
              ? Provider.of<LabelToolBloc>(context).cancelUpdatingSelection()
              : Provider.of<LabelToolBloc>(context).cancelCurrentSelection(),
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
          isUpdating ? "Update" : "Done",
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
        return ListView(
          shrinkWrap: true,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Text("Select label",
                      style: Theme.of(context).textTheme.title),
                  FlatButton.icon(
                    icon: Icon(Icons.add),
                    label: Text("Add"),
                    onPressed: () {
                      Navigator.pop(context);
                      _showAddLabelModel(baseContext);
                    },
                  ),
                ],
              ),
            ),
            SizedBox(
              height: 8,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: state.labels == null
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
            ),
          ],
        );
      },
    );
  }

  _showAddLabelModel(BuildContext baseContext) {
    showDialog<bool>(
      context: baseContext,
      builder: (context) {
        return AddEditLabelDialog(
          Provider.of<LabelToolBloc>(baseContext).projectId,
        );
      },
    ).then((bool isSuccess) {
      if (isSuccess) {
        Provider.of<LabelToolBloc>(baseContext).refresh();
      }
    });
  }
}
