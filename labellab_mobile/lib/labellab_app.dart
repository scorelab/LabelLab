import 'package:fluro/fluro.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/routing/routes.dart';
import 'package:provider/provider.dart';

class LabelLabApp extends StatelessWidget {
  LabelLabApp() {
    final router = FluroRouter();
    Routes.configureRouter(router);
    Application.router = router;
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<AuthState>(
      create: (context) => AuthState(),
      child: MaterialApp(
        title: 'LabelLab',
        theme: ThemeData(
          primarySwatch: Colors.teal,
          primaryColor: Theme.of(context).canvasColor,
          primaryColorLight: Color(0xffffffff),
          primaryColorDark: Color(0xffc2c2c2),
          accentColor: Color(0xff00a89f),
          accentColorBrightness: Brightness.light,
          textButtonTheme: TextButtonThemeData(
            style: TextButton.styleFrom(
              primary: Color(0xff575151),
            ),
          ),
        ),
        //darkTheme: ThemeData.dark(),
        darkTheme: ThemeData(
          primarySwatch: Colors.teal,
          primaryColor: Theme.of(context).canvasColor,
          primaryColorLight: Color(0xffffffff),
          primaryColorDark: Color(0xffc2c2c2),
          accentColor: Color(0xff00a89f),
          accentColorBrightness: Brightness.dark,
          textButtonTheme: TextButtonThemeData(
            style: TextButton.styleFrom(
              primary: Color(0xff575151),
            ),
          ),
        ),
        debugShowCheckedModeBanner: false,
        onGenerateRoute: Application.router.generator,
      ),
    );
  }
}
