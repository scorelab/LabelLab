import 'package:labellab_mobile/model/group.dart';

class ProjectViewGroupState {
  bool isLoading = false;
  String? error;
  Group? group;

  ProjectViewGroupState.loading({this.group}) {
    isLoading = true;
  }

  ProjectViewGroupState.error(this.error, {this.group});

  ProjectViewGroupState.success({this.group});
}
