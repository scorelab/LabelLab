import 'package:labellab_mobile/model/project.dart';

class ProjectState {
  late bool isLoading;
  String? error;
  String? updateError;
  List<Project>? projects;

  ProjectState.loading({this.projects}) {
    isLoading = true;
  }

  ProjectState.error(this.error, {this.projects}) {
    this.isLoading = false;
  }

  ProjectState.updateError(this.error, {this.projects}) {
    this.isLoading = false;
  }

  ProjectState.success(this.projects) {
    this.isLoading = false;
  }
}