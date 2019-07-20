import 'dart:io';

class UploadImageState {
  static const PENDING = 0;
  static const LOADING = 1;
  static const SUCCESS = 2;
  static const ERROR = 3;
}

class UploadImage {
  int state;
  File image;

  UploadImage({this.image}) {
    this.state = UploadImageState.PENDING;
  }
  

}
