import 'package:labellab_mobile/model/team.dart';

class TeamDetailsState {
  String? projectId;
  String? teamId;
  Team? team;
  String? error;
  bool isLoading = false;

  TeamDetailsState.loading() {
    this.isLoading = true;
  }

  TeamDetailsState.success(this.projectId, this.teamId, this.team) {
    this.isLoading = false;
  }

  TeamDetailsState.error(this.error) {
    this.isLoading = false;
  }
}
