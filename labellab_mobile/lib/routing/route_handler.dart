import 'package:flutter/material.dart';
import 'package:fluro/fluro.dart';
import 'package:labellab_mobile/screen/classification/classification_bloc.dart';
import 'package:labellab_mobile/screen/classification/classification_screen.dart';
import 'package:labellab_mobile/screen/classify/classify_bloc.dart';
import 'package:labellab_mobile/screen/classify/classify_screen.dart';
import 'package:labellab_mobile/screen/login/login_screen.dart';
import 'package:labellab_mobile/screen/main_screen.dart';
import 'package:labellab_mobile/screen/profile/profile_screen.dart';
import 'package:labellab_mobile/screen/profile/project_bloc.dart';
import 'package:labellab_mobile/screen/project/add_edit/add_edit_project_screen.dart';
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
