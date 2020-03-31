import 'package:labellab_mobile/model/classification.dart';

class ClassificationHistoryState {
  bool isLoading;
  String error;
  List<Classification> classifications;

  ClassificationHistoryState.loading({this.classifications}) {
    isLoading = true;
  }

  ClassificationHistoryState.error(this.error, {this.classifications}) {
    this.isLoading = false;
  }

  ClassificationHistoryState.success(this.classifications) {
    this.isLoading = false;
  }
}