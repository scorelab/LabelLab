import 'dart:io';

class ProjectEditImageState {
  bool isLoading = false;
  bool isEdited = false;
  String error;
  File image;

  ProjectEditImageState.loading({this.image}) {
    isLoading = true;
  }

  ProjectEditImageState.error(this.error, {this.image});

  ProjectEditImageState.success({this.image});

  ProjectEditImageState.edited({this.image}) {
    isEdited = true;
  }
}
