import 'dart:io';

class ProjectEditImageState {
  bool isLoading;
  String error;
  File image;

  ProjectEditImageState.loading({this.image}) {
    isLoading = true;
  }

  ProjectEditImageState.error(this.error, {this.image}) {
    isLoading = false;
  }

  ProjectEditImageState.success({this.image}) {
    isLoading = false;
  }
}
