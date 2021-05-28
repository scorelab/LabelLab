import 'package:labellab_mobile/model/image.dart';

class ProjectViewImageState {
  late bool isLoading;
  String? error;
  Image? image;

  ProjectViewImageState.loading({this.image}) {
    isLoading = true;
  }

  ProjectViewImageState.error(this.error, {this.image}) {
    this.isLoading = false;
  }

  ProjectViewImageState.success({this.image}) {
    this.isLoading = false;
  }
}