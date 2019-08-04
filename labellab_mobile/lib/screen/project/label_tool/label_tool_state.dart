import 'package:labellab_mobile/screen/project/label_tool/label_selection.dart';

class LabelToolState {
  List<LabelSelection> selections;
  LabelSelection currentSelection;
  bool isLoading = false;
  bool isSuccess = false;

  LabelToolState.initial() {
    selections = [];
  }

  LabelToolState.drawingSelection(this.selections, {this.currentSelection});

  LabelToolState.doneSelection(this.selections);

  LabelToolState.saving(this.selections) {
    isLoading = true;
  }

  LabelToolState.success(this.selections) {
    isSuccess = true;
  }
}
