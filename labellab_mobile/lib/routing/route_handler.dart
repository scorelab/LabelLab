import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/home/home_screen.dart';
import 'package:fluro/fluro.dart';

var homeHandler = Handler(handlerFunc: (BuildContext context, Map<String, List<String>> params) {
  return HomeScreen();
});