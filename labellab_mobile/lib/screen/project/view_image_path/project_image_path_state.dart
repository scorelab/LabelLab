import 'package:labellab_mobile/model/location.dart';

class ProjectImagePathState {
  bool isLoading = false;
  String error;
  List<Location> locations;

  ProjectImagePathState.loading({this.locations}) {
    isLoading = true;
  }

  ProjectImagePathState.error(this.error, {this.locations});

  ProjectImagePathState.success({this.locations});
}
