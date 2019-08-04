import 'package:fluro/fluro.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_bloc.dart';
import 'package:labellab_mobile/screen/project/label_tool/label_tool_screen.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/routing/routes.dart';
import 'package:provider/provider.dart';

class LabelLabApp extends StatelessWidget {
  LabelLabApp() {
    final router = Router();
    Routes.configureRouter(router);
    Application.router = router;
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<AuthState>(
      builder: (context) => AuthState(),
      child: MaterialApp(
        title: 'LabelLab',
        theme: ThemeData(
          primaryColor: Color(0xfff5f5f5),
          primaryColorLight: Color(0xffffffff),
          primaryColorDark: Color(0xffc2c2c2),
          accentColor: Color(0xff00a89f),
          accentColorBrightness: Brightness.light,
        ),
        debugShowCheckedModeBanner: false,
        onGenerateRoute: Application.router.generator,
      ),
    );
  }
}
