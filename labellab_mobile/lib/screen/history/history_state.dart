import 'package:labellab_mobile/model/classification.dart';

class HistoryState {
  bool isLoading;
  String error;
  List<Classification> classifications;

  HistoryState.loading({this.classifications}) {
    isLoading = true;
  }

  HistoryState.error(this.error, {this.classifications}) {
    this.isLoading = false;
  }

  HistoryState.success(this.classifications) {
    this.isLoading = false;
  }
}