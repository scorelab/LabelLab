import 'package:labellab_mobile/model/image.dart';

class ProjectMoreImagesState {
  bool? isLoading;
  String? error;
  List<Image>? images;

  ProjectMoreImagesState.loading({this.images}) {
    isLoading = true;
  }

  ProjectMoreImagesState.error(this.error, {this.images}) {
    this.isLoading = false;
  }

  ProjectMoreImagesState.updateError(this.error, {this.images}) {
    this.isLoading = false;
  }

  ProjectMoreImagesState.success(this.images) {
    this.isLoading = false;
  }
}
