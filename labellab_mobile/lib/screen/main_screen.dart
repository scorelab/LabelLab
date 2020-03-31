import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/object_detection.dart';
import 'package:labellab_mobile/screen/history/classification_history_bloc.dart';
import 'package:labellab_mobile/screen/history/history_screen.dart';
import 'package:labellab_mobile/screen/history/object_detection_history_bloc.dart';
import 'package:labellab_mobile/screen/home/home_screen.dart';
import 'package:labellab_mobile/screen/project/project_bloc.dart';
import 'package:labellab_mobile/screen/project/project_screen.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:page_view_indicator/page_view_indicator.dart';
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
  final pageIndexNotifier = ValueNotifier<int>(1);

  @override
  Widget build(BuildContext context) {
    return Provider<PageController>(
      builder: (context) => _pageController,
      child: Consumer<AuthState>(
        builder: (context, AuthState authState, widget) {
          return Stack(
            children: <Widget>[
              authState.user != null
                  ? PageView(
                      onPageChanged: (index) => pageIndexNotifier.value = index,
                      controller: _pageController,
                      children: <Widget>[
                        HistoryScreen(),
                        HomeScreen(),
                        Provider<ProjectBloc>(
                          builder: (context) => ProjectBloc(),
                          dispose: (context, bloc) => bloc.dispose(),
                          child: ProjectScreen(),
                        ),
                      ],
                    )
                  : PageView(
                      onPageChanged: (index) => pageIndexNotifier.value = index,
                      controller: _pageController,
                      children: <Widget>[
                        HistoryScreen(),
                        HomeScreen(),
                      ],
                    ),
              Padding(
                padding: EdgeInsets.only(top: 8),
                child: _buildPageIndicator(
                  context,
                  authState.user != null ? 3 : 2,
                ),
              )
            ],
          );
        },
      ),
    );
  }

  Widget _buildPageIndicator(BuildContext context, int length) {
    return SafeArea(
      child: PageViewIndicator(
        indicatorPadding: EdgeInsets.symmetric(horizontal: 4),
        pageIndexNotifier: pageIndexNotifier,
        length: length,
        normalBuilder: (animationController, index) => Circle(
          size: 4.0,
          color: Colors.black87,
        ),
        highlightedBuilder: (animationController, index) => ScaleTransition(
          scale: CurvedAnimation(
            parent: animationController,
            curve: Curves.ease,
          ),
          child: Circle(
            size: 6.0,
            color: Colors.black,
          ),
        ),
      ),
    );
  }
}
