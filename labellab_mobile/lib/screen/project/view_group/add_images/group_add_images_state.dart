import 'package:labellab_mobile/model/image.dart';

class GroupAddImagesState {
  bool isLoading = false;
  String? error;
  List<Image>? images;
  List<String?>? selectedImages;

  GroupAddImagesState.loading({this.images, this.selectedImages}) {
    isLoading = true;
  }

  GroupAddImagesState.error(this.error, {this.images, this.selectedImages});

  GroupAddImagesState.success({this.images, this.selectedImages});
}
