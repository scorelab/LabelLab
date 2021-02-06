import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/label_selection.dart';

class LabelToolState {
  List<LabelSelection> selections;
  LabelSelection currentSelection;
  Image image;
  List<Label> labels;
  String error;
  bool isLoading = false;
  bool isSaving = false;
  bool isSuccess = false;
  bool isUpdating = false;

  LabelToolState.initial() {
    selections = [];
  }

  LabelToolState.loading({this.selections}) {
    isLoading = true;
  }

  LabelToolState.loaded(this.labels, this.image, {this.selections});

  LabelToolState.drawingSelection(this.selections, this.image,
      {this.labels, this.currentSelection});

  LabelToolState.updatingSelection(this.selections, this.image,
      {this.labels, this.currentSelection}) {
    isUpdating = true;
  }

  LabelToolState.doneSelection(this.selections, this.image, {this.labels});

  LabelToolState.saving(this.selections, this.image, {this.labels}) {
    isSaving = true;
  }

  LabelToolState.success(this.selections, this.image, {this.labels}) {
    isSuccess = true;
  }

  LabelToolState.error(this.error, this.selections, this.image, {this.labels});
}
