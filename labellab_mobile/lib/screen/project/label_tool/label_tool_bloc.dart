import 'dart:async';
import 'dart:math';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_selection.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_state.dart';

class LabelToolBloc {
  Repository _repository = Repository();

  final String projectId;
  final String imageId;

  List<LabelSelection> _selections = [];
  LabelSelection _currentSelection;
  Image _image;
  List<Label> _labels = [];
  bool _isLoading = false;

  LabelToolBloc(this.projectId, this.imageId) {
    _loadImageAndLabels();
  }

  void _loadImageAndLabels() {
    if (_isLoading) return;
    _isLoading = true;
    _setState(LabelToolState.loading(selections: _selections));
    final getImage = _repository.getImage(imageId).then((image) {
      _image = image;
    });
    final getLabels = _repository.getLabels(projectId).then((labels) {
      this._labels = labels;
    });
    Future.wait([getImage, getLabels]).then((_) {
      _setState(
          LabelToolState.loaded(_labels, _image, selections: _selections));
    });
  }

  void selectLabel(Label label) {
    _currentSelection = LabelSelection(label);
    _setState(LabelToolState.drawingSelection(_selections, _image,
        labels: _labels, currentSelection: _currentSelection));
  }

  void startCurrentSelection(Point point) {
    _currentSelection.setStartPoint(point);
    _setState(LabelToolState.drawingSelection(_selections, _image,
        labels: _labels, currentSelection: _currentSelection));
  }

  void updateCurrentSelection(Point point) {
    _currentSelection.setEndPoint(point);
    _setState(LabelToolState.drawingSelection(_selections, _image,
        labels: _labels, currentSelection: _currentSelection));
  }

  void cancelCurrentSelection() {
    _currentSelection = null;
    _setState(
        LabelToolState.doneSelection(_selections, _image, labels: _labels));
  }

  void resetCurrentSelection() {
    _currentSelection.points.removeRange(0, _currentSelection.points.length);
    _setState(LabelToolState.drawingSelection(_selections, _image,
        labels: _labels, currentSelection: _currentSelection));
  }

  void saveCurrentSelection() {
    _selections.add(_currentSelection);
    _currentSelection = null;
    _setState(
        LabelToolState.doneSelection(_selections, _image, labels: _labels));
  }

  void removeSelection(LabelSelection selection) {
    _selections.remove(selection);
    _setState(LabelToolState.drawingSelection(_selections, _image,
        currentSelection: _currentSelection, labels: _labels));
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
