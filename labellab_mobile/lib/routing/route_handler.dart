import 'package:flutter/material.dart';
import 'package:fluro/fluro.dart';
import 'package:labellab_mobile/screen/login/login_screen.dart';
import 'package:labellab_mobile/screen/main_screen.dart';
import 'package:labellab_mobile/screen/sign_up/sign_up_screen.dart';

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
