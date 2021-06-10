import 'package:flutter/material.dart';
import 'package:fluro/fluro.dart';
import 'package:labellab_mobile/screen/backend_selection/backend_selection_screen.dart';
import 'package:labellab_mobile/screen/backend_selection/init_screen.dart';
import 'package:labellab_mobile/screen/classification/classification_bloc.dart';
import 'package:labellab_mobile/screen/classification/classification_screen.dart';
import 'package:labellab_mobile/screen/classify/classify_bloc.dart';
import 'package:labellab_mobile/screen/classify/classify_screen.dart';
import 'package:labellab_mobile/screen/login/login_screen.dart';
import 'package:labellab_mobile/screen/main_screen.dart';
import 'package:labellab_mobile/screen/profile/edit_info/edit_info_screen.dart';
import 'package:labellab_mobile/screen/profile/profile_bloc.dart';
import 'package:labellab_mobile/screen/profile/profile_screen.dart';
import 'package:labellab_mobile/screen/profile/update_password/update_password_screen.dart';
import 'package:labellab_mobile/screen/project/add_edit/add_edit_project_screen.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_bloc.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_screen.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_bloc.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_screen.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_bloc.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_screen.dart';
import 'package:labellab_mobile/screen/project/ml_model/history/model_history_bloc.dart';
import 'package:labellab_mobile/screen/project/ml_model/history/model_history_screen.dart';
import 'package:labellab_mobile/screen/project/project_activity/project_activity_bloc.dart';
import 'package:labellab_mobile/screen/project/project_activity/project_activity_screen.dart';
import 'package:labellab_mobile/screen/project/upload_image/project_upload_image_bloc.dart';
import 'package:labellab_mobile/screen/project/upload_image/project_upload_image_screen.dart';
import 'package:labellab_mobile/screen/project/view_group/add_images/group_add_images_bloc.dart';
import 'package:labellab_mobile/screen/project/view_group/add_images/group_add_images_screen.dart';
import 'package:labellab_mobile/screen/project/view_group/project_view_group_bloc.dart';
import 'package:labellab_mobile/screen/project/view_group/project_view_group_screen.dart';
import 'package:labellab_mobile/screen/project/view_image/project_view_image_bloc.dart';
import 'package:labellab_mobile/screen/project/view_image/project_view_image_screen.dart';
import 'package:labellab_mobile/screen/project/view_image_path/project_image_path_bloc.dart';
import 'package:labellab_mobile/screen/project/view_image_path/project_image_path_screen.dart';
import 'package:labellab_mobile/screen/project/view_more_images/project_more_images_bloc.dart';
import 'package:labellab_mobile/screen/project/view_more_images/project_more_images_screen.dart';
import 'package:labellab_mobile/screen/sign_up/sign_up_screen.dart';
import 'package:labellab_mobile/screen/train/model_train_bloc.dart';
import 'package:labellab_mobile/screen/train/model_train_screen.dart';
import 'package:provider/provider.dart';

var initHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return InitScreen();
});

var mainHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return MainScreen();
});

var loginHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return LoginScreen();
});

var signupHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return SignUpScreen();
});

var updatePasswordHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return UpdatePasswordScreen();
});

var profileHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ProfileBloc>(
    create: (context) => ProfileBloc(),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProfileScreen(),
  );
});

var editInfoHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ProfileBloc>(
    create: (context) => ProfileBloc(),
    dispose: (context, bloc) => bloc.dispose(),
    child: EditInfoScreen(params['username']!.first),
  );
});

var addProjectHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return AddEditProjectScreen();
});

var editProjectHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return AddEditProjectScreen(id: params['id']!.first);
});

var detailProjectHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ProjectDetailBloc>(
    create: (context) => ProjectDetailBloc(params['id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProjectDetailScreen(),
  );
});

var projectActivityHandler = Handler(
  handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
    return Provider<ProjectActivityBloc>(
      create: (context) => ProjectActivityBloc(params['id']!.first),
      dispose: (context, bloc) => bloc.dispose(),
      child: ProjectActivityScreen(),
    );
  },
);

var entitySpecificProjectActivityHandler = Handler(
  handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
    return Provider<ProjectActivityBloc>(
      create: (context) => ProjectActivityBloc(
        params['id']!.first,
        entityType: params['entity_type']!.first,
        entityId: params['entity_id']!.first,
      ),
      dispose: (context, bloc) => bloc.dispose(),
      child: ProjectActivityScreen(entitySpecific: true),
    );
  },
);

var addMemberProjectHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ProjectAddMemberBloc>(
    create: (context) => ProjectAddMemberBloc(params['id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProjectAddMemberScreen(),
  );
});

var moreImagesProjectHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ProjectMoreImagesBloc>(
    create: (context) => ProjectMoreImagesBloc(params['id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProjectMoreImagesScreen(),
  );
});

var uploadImageHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ProjectUploadImageBloc>(
    create: (context) => ProjectUploadImageBloc(params['project_id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProjectUploadImageScreen(),
  );
});

var viewImageHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ProjectViewImageBloc>(
    create: (context) => ProjectViewImageBloc(
        params['project_id']!.first, params['image_id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProjectViewImageScreen(),
  );
});

var viewGroupHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ProjectViewGroupBloc>(
    create: (context) => ProjectViewGroupBloc(
        params['project_id']!.first, params['group_id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProjectViewGroupScreen(),
  );
});

var addGroupImagesHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<GroupAddImagesBloc>(
    create: (context) => GroupAddImagesBloc(
        params['project_id']!.first, params['group_id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: GroupAddImagesScreen(),
  );
});

var labelImageHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<LabelToolBloc>(
    create: (context) =>
        LabelToolBloc(params['project_id']!.first, params['image_id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: LabelToolScreen(),
  );
});

var viewPathHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ProjectImagePathBloc>(
    create: (context) => ProjectImagePathBloc(
        params['project_id']!.first, params['image_id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProjectImagePathScreen(),
  );
});

var classifyHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ClassifyBloc>(
    create: (context) => ClassifyBloc(),
    dispose: (context, bloc) => bloc.dispose(),
    child: ClassifyScreen(params['by']!.first == 'camera'),
  );
});

var classificationHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ClassificationBloc>(
    create: (context) => ClassificationBloc(params['id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ClassificationScreen(),
  );
});

var modelTrainHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ModelTrainBloc>(
    create: (context) =>
        ModelTrainBloc(params['project_id']!.first, params['model_id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ModelTrainScreen(),
  );
});

var modelHistoryHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return Provider<ModelHistoryBloc>(
    create: (context) => ModelHistoryBloc(
        params['project_id']!.first, params['model_id']!.first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ModelHistoryScreen(),
  );
});

var backendServiceSelectionHandler = Handler(
    handlerFunc: (BuildContext? context, Map<String, List<String>> params) {
  return BackendSelectionScreen();
});
