import 'dart:async';
import 'dart:math';

import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_selection.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_state.dart';

class LabelToolBloc {
  Repository _repository = Repository();

  List<LabelSelection> _selections = [];
  LabelSelection _currentSelection;
  bool _isLoading = false;

  LabelToolBloc();

  void selectLabel(Label label) {
    _currentSelection = LabelSelection(label);
    _setState(LabelToolState.drawingSelection(_selections,
        currentSelection: _currentSelection));
  }

  void startCurrentSelection(Point point) {
    _currentSelection.setStartPoint(point);
    _setState(LabelToolState.drawingSelection(_selections,
        currentSelection: _currentSelection));
  }

  void updateCurrentSelection(Point point) {
    _currentSelection.setEndPoint(point);
    _setState(LabelToolState.drawingSelection(_selections,
        currentSelection: _currentSelection));
  }

  void cancelCurrentSelection() {
    _currentSelection = null;
    _setState(LabelToolState.doneSelection(_selections));
  }

  void resetCurrentSelection() {
    _currentSelection.points.removeRange(0, _currentSelection.points.length);
    _setState(LabelToolState.drawingSelection(_selections,
        currentSelection: _currentSelection));
  }

  void saveCurrentSelection() {
    _selections.add(_currentSelection);
    _currentSelection = null;
    _setState(LabelToolState.doneSelection(_selections));
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
