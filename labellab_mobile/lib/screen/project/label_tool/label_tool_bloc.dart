import 'dart:async';
import 'dart:math';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/label_selection.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_state.dart';
import 'package:labellab_mobile/util/util.dart';

class LabelToolBloc {
  Repository _repository = Repository();

  final String projectId;
  final String imageId;

  List<LabelSelection?>? _selections = [];
  LabelSelection? _currentSelection;

  bool _isUpdating = false;

  // Holds the previous index and the selection
  late int _tempIndex;
  LabelSelection? _tempSelection;

  Image? _image;
  List<Label> _labels = [];
  bool _isLoading = false;
  SelectionOffset _selectionOffset = SelectionOffset.zero;

  LabelToolBloc(this.projectId, this.imageId) {
    _loadImageAndLabels();
  }

  void _loadImageAndLabels() {
    _setState(LabelToolState.loading(selections: _selections));
    final getImage = _repository.getImage(imageId).then((image) {
      _image = image;
      if (image.labels != null) _selections = image.labels;
    });
    final getLabels = _repository.getLabels(projectId).then((labels) {
      this._labels = labels;
    });
    Future.wait([getImage, getLabels]).then((_) {
      _setState(
          LabelToolState.loaded(_labels, _image, selections: _selections));
    });
  }

  void setCanvasSelectionOffset(SelectionOffset offset) {
    _selectionOffset = offset;
  }

  void selectLabel(Label label) {
    _currentSelection = LabelSelection(label);
    _setState(LabelToolState.drawingSelection(_selections, _image,
        labels: _labels, currentSelection: _currentSelection));
  }

  void startCurrentSelection(Point point) {
    _currentSelection!.setStartPoint(point);
    _setState(_isUpdating
        ? LabelToolState.updatingSelection(_selections, _image,
            labels: _labels, currentSelection: _currentSelection)
        : LabelToolState.drawingSelection(_selections, _image,
            labels: _labels, currentSelection: _currentSelection));
  }

  void updateCurrentSelection(Point point) {
    _currentSelection!.setEndPoint(point);
    _setState(_isUpdating
        ? LabelToolState.updatingSelection(_selections, _image,
            labels: _labels, currentSelection: _currentSelection)
        : LabelToolState.drawingSelection(_selections, _image,
            labels: _labels, currentSelection: _currentSelection));
  }

  void appendToCurrentSelection(Point point) {
    _currentSelection!.appendPoint(point);
    _setState(_isUpdating
        ? LabelToolState.updatingSelection(_selections, _image,
            labels: _labels, currentSelection: _currentSelection)
        : LabelToolState.drawingSelection(_selections, _image,
            labels: _labels, currentSelection: _currentSelection));
  }

  void cancelCurrentSelection() {
    _currentSelection = null;
    _setState(
        LabelToolState.doneSelection(_selections, _image, labels: _labels));
  }

  void resetCurrentSelection() {
    _currentSelection!.points.removeRange(0, _currentSelection!.points.length);
    _setState(_isUpdating
        ? LabelToolState.updatingSelection(_selections, _image,
            labels: _labels, currentSelection: _currentSelection)
        : LabelToolState.drawingSelection(_selections, _image,
            labels: _labels, currentSelection: _currentSelection));
  }

  void undoFromCurrentSelection() {
    _currentSelection!.points.removeLast();
    _setState(_isUpdating
        ? LabelToolState.updatingSelection(_selections, _image,
            labels: _labels, currentSelection: _currentSelection)
        : LabelToolState.drawingSelection(_selections, _image,
            labels: _labels, currentSelection: _currentSelection));
  }

  void saveCurrentSelection() {
    _isUpdating
        ? _selections!.insert(_tempIndex, _currentSelection)
        : _selections!.add(_currentSelection);
    _isUpdating = false;
    _currentSelection = null;
    _setState(
        LabelToolState.doneSelection(_selections, _image, labels: _labels));
  }

  void removeSelection(LabelSelection? selection) {
    _selections!.remove(selection);
    _setState(LabelToolState.drawingSelection(_selections, _image,
        currentSelection: _currentSelection, labels: _labels));
  }

  // Provoke selection update
  void updateSelection(LabelSelection? selection) {
    _isUpdating = true;
    _tempIndex = _selections!.indexOf(selection);
    _tempSelection = selection;
    _selections!.remove(selection);
    _currentSelection = LabelSelection(selection!.label);
    _setState(LabelToolState.updatingSelection(_selections, _image,
        labels: _labels, currentSelection: _currentSelection));
  }

  // Cancel selection update
  void cancelUpdatingSelection() {
    _isUpdating = false;
    _selections!.insert(_tempIndex, _tempSelection);
    _currentSelection = null;
    _setState(
        LabelToolState.doneSelection(_selections, _image, labels: _labels));
  }

  void refresh() {
    _loadImageAndLabels();
  }

  void uploadSelections() {
    print("Uploading selections");
    if (_isLoading) return;
    _isLoading = true;
    print("Not pending");
    _setState(LabelToolState.saving(_selections, _image, labels: _labels));

    // Scale and remove offset from unadjusted images
    final adjustedSelections = _selections!.map((selection) {
      if (selection!.isAdjusted) return selection;
      final adjustedPoints = selection.points.map((point) {
        return Point((point.x - _selectionOffset.dx) * _selectionOffset.scale,
            (point.y - _selectionOffset.dy) * _selectionOffset.scale);
      }).toList();
      return LabelSelection.adjusted(
          selection.label, adjustedPoints, selection.color);
    }).toList();

    _repository.updateImage(projectId, _image, adjustedSelections).then((res) {
      _isLoading = false;
      if (res.success!) {
        _setState(LabelToolState.success(_selections, _image, labels: _labels));
      } else {
        _setState(LabelToolState.error(res.msg, _selections, _image,
            labels: _labels));
      }
    }).catchError((err) {
      _isLoading = false;
      _setState(LabelToolState.error(err.toString(), _selections, _image,
          labels: _labels));
    });
  }

  // State stream
  StreamController<LabelToolState> _stateController =
      StreamController<LabelToolState>();

  Stream<LabelToolState> get state => _stateController.stream;

  _setState(LabelToolState state) {
    if (!_stateController.isClosed) _stateController.add(state);
  }

  void dispose() {
    _stateController.close();
  }
}
