import 'package:labellab_mobile/model/project.dart';

class ProjectDetailState {
  bool isLoading = false;
  bool isSelecting = false;
  String error;
  Project project;
  List<String> selectedImages = [];

  ProjectDetailState.loading({this.project}) {
    isLoading = true;
  }

  ProjectDetailState.error(this.error, {this.project});

  ProjectDetailState.updateError(this.error, {this.project});

  // Define state for images selection state
  ProjectDetailState.multiSelect(this.project, {this.selectedImages}) {
    isSelecting = true;
  }

  ProjectDetailState.success(this.project);
}
