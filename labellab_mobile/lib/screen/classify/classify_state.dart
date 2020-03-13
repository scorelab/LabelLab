import 'dart:io';

import 'package:labellab_mobile/model/classification.dart';

class ClassifyState {
  bool isClassifing;
  Classification classification;
  String error;
  File image;

  ClassifyState.initial() {
    isClassifing = false;
  }

  ClassifyState.loading({this.image}) {
    isClassifing = true;
  }

  ClassifyState.setImage({this.image}) {
    isClassifing = false;
  }

  ClassifyState.error(this.error, {this.image}) {
    isClassifing = false;
  }

  ClassifyState.classified(this.classification, {this.image}) {
    isClassifing = false;
  }
}