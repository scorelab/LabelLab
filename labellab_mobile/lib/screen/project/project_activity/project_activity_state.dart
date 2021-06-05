import 'package:labellab_mobile/model/log.dart';

class ProjectActivityState {
  late bool isLoading;
  String? error;
  String? updateError;
  List<Log>? logs;

  ProjectActivityState.loading() {
    isLoading = true;
  }

  ProjectActivityState.error(this.error) {
    this.isLoading = false;
  }

  ProjectActivityState.updateError(this.error) {
    this.isLoading = false;
  }

  ProjectActivityState.success(this.logs) {
    this.isLoading = false;
  }
}
