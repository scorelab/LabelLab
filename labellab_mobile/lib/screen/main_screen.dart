import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/history/history_screen.dart';
import 'package:labellab_mobile/screen/home/home_screen.dart';
import 'package:labellab_mobile/screen/project/project_screen.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:provider/provider.dart';

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  final PageController _pageController = new PageController(
    initialPage: 1,
    keepPage: true,
  );

  @override
  Widget build(BuildContext context) {
    return Provider<PageController>(
      builder: (context) => _pageController,
      child: Consumer<AuthState>(
        builder: (context, AuthState authState, widget) {
          if (authState.user != null) {
            return PageView(
              controller: _pageController,
              children: <Widget>[
                HistoryScreen(),
                HomeScreen(),
                ProjectScreen(),
              ],
            );
          } else {
            return PageView(
              controller: _pageController,
              children: <Widget>[
                HistoryScreen(),
                HomeScreen(),
              ],
            );
          }
        },
      ),
    );
  }
}
