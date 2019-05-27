import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/home/home_screen.dart';

class LabelLabApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LabelLab',
      theme: ThemeData(
        primaryColor: Color(0xf5f5f5),
        primaryColorLight: Color(0xffffff),
        primaryColorDark: Color(0xc2c2c2),
        accentColor: Color(0x00a89f),
        accentColorBrightness: Brightness.light,
      ),
      home: HomeScreen(),
    );
  }
}
