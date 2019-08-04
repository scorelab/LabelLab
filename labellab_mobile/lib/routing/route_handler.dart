import 'package:flutter/material.dart';
import 'package:fluro/fluro.dart';
import 'package:labellab_mobile/screen/classification/classification_bloc.dart';
import 'package:labellab_mobile/screen/classification/classification_screen.dart';
import 'package:labellab_mobile/screen/classify/classify_bloc.dart';
import 'package:labellab_mobile/screen/classify/classify_screen.dart';
import 'package:labellab_mobile/screen/login/login_screen.dart';
import 'package:labellab_mobile/screen/main_screen.dart';
import 'package:labellab_mobile/screen/profile/profile_bloc.dart';
import 'package:labellab_mobile/screen/profile/profile_screen.dart';
import 'package:labellab_mobile/screen/project/add_edit/add_edit_project_screen.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_bloc.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_screen.dart';
import 'package:labellab_mobile/screen/project/detail/project._detail_bloc.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_screen.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_bloc.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_screen.dart';
import 'package:labellab_mobile/screen/project/upload_image/project_upload_image_bloc.dart';
import 'package:labellab_mobile/screen/project/upload_image/project_upload_image_screen.dart';
import 'package:labellab_mobile/screen/project/view_image/project_view_image_bloc.dart';
import 'package:labellab_mobile/screen/project/view_image/project_view_image_screen.dart';
import 'package:labellab_mobile/screen/sign_up/sign_up_screen.dart';
import 'package:provider/provider.dart';

var mainHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return MainScreen();
});

var loginHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return LoginScreen();
});

var signupHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return SignUpScreen();
});

var profileHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return Provider<ProfileBloc>(
    builder: (context) => ProfileBloc(),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProfileScreen(),
  );
});

var addProjectHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return AddEditProjectScreen();
});

var editProjectHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return AddEditProjectScreen(id: params['id'].first);
});

var detailProjectHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return Provider<ProjectDetailBloc>(
    builder: (context) => ProjectDetailBloc(params['id'].first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProjectDetailScreen(),
  );
});

var addMemberProjectHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return Provider<ProjectAddMemberBloc>(
    builder: (context) => ProjectAddMemberBloc(params['id'].first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProjectAddMemberScreen(),
  );
});

var uploadImageHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return Provider<ProjectUploadImageBloc>(
    builder: (context) => ProjectUploadImageBloc(params['project_id'].first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProjectUploadImageScreen(),
  );
});

var viewImageHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return Provider<ProjectViewImageBloc>(
    builder: (context) => ProjectViewImageBloc(
        params['project_id'].first, params['image_id'].first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ProjectViewImageScreen(),
  );
});

var labelImageHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return Provider<LabelToolBloc>(
    builder: (context) => LabelToolBloc(),
    dispose: (context, bloc) => bloc.dispose(),
    child: LabelToolScreen(),
  );
});

var classifyHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return Provider<ClassifyBloc>(
    builder: (context) => ClassifyBloc(),
    dispose: (context, bloc) => bloc.dispose(),
    child: ClassifyScreen(params['by'].first == 'camera'),
  );
});

var classificationHandler = Handler(
    handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return Provider<ClassificationBloc>(
    builder: (context) => ClassificationBloc(params['id'].first),
    dispose: (context, bloc) => bloc.dispose(),
    child: ClassificationScreen(),
  );
});
