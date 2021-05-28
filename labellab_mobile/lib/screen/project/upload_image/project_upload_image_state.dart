import 'package:labellab_mobile/model/upload_image.dart';

class ProjectUploadImageState {
  late bool isLoading;
  bool isSuccess = false;
  String? error;
  List<UploadImage>? images = [];

  ProjectUploadImageState.initial() {
    this.isLoading = false;
  }

  ProjectUploadImageState.loading({this.images}) {
    isLoading = true;
  }

  ProjectUploadImageState.imageChange({this.images}) {
    this.isLoading = false;
  }

  ProjectUploadImageState.error(this.error, {this.images}) {
    this.isLoading = false;
  }

  ProjectUploadImageState.success({this.images}) {
    this.isLoading = false;
    this.isSuccess = true;
  }
}