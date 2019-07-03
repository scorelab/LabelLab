import 'package:labellab_mobile/model/project.dart';

class ProjectDetailState {
  bool isLoading;
  String error;
  Project project;

  ProjectDetailState.loading({this.project}) {
    isLoading = true;
  }

  ProjectDetailState.error(this.error, {this.project}) {
    this.isLoading = false;
  }

  ProjectDetailState.updateError(this.error, {this.project}) {
    this.isLoading = false;
  }

  ProjectDetailState.success(this.project) {
    this.isLoading = false;
  }
}
