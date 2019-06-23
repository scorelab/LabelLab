import 'package:labellab_mobile/model/classification.dart';

class ClassificationState {
  bool isLoading;
  String error;
  Classification classification;

  ClassificationState.loading({this.classification}) {
    isLoading = true;
  }

  ClassificationState.error(this.error, {this.classification}) {
    this.isLoading = false;
  }

  ClassificationState.success(this.classification) {
    this.isLoading = false;
  }
}