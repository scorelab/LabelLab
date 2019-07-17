import 'package:labellab_mobile/data/repository.dart';

class ProjectUploadImageBloc {
  Repository _repository = Repository();

  String projectId;

  ProjectUploadImageBloc(this.projectId);

  void dispose() {

  }

}