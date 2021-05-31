import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/history/history_bloc.dart';
import 'package:labellab_mobile/screen/history/history_screen.dart';
import 'package:labellab_mobile/screen/home/home_screen.dart';
import 'package:labellab_mobile/screen/project/project_bloc.dart';
import 'package:labellab_mobile/screen/project/project_screen.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
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
      create: (context) => _pageController,
      child: Consumer<AuthState>(
        builder: (context, AuthState authState, widget) {
          return Stack(
            children: <Widget>[
              authState.user != null
                  ? PageView(
                      onPageChanged: (index) => pageIndexNotifier.value = index,
                      controller: _pageController,
                      children: <Widget>[
                        Provider<HistoryBloc>(
                          create: (context) => HistoryBloc(),
                          dispose: (context, bloc) => bloc.dispose(),
                          child: HistoryScreen(),
                        ),
                        HomeScreen(),
                        Provider<ProjectBloc>(
                          create: (context) => ProjectBloc(),
                          dispose: (context, bloc) => bloc.dispose(),
                          child: ProjectScreen(),
                        ),
                      ],
                    )
                  : PageView(
                      onPageChanged: (index) => pageIndexNotifier.value = index,
                      controller: _pageController,
                      children: <Widget>[
                        Provider<HistoryBloc>(
                          create: (context) => HistoryBloc(),
                          dispose: (context, bloc) => bloc.dispose(),
                          child: HistoryScreen(),
                        ),
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
      child: Container(
        alignment: Alignment.topCenter,
        child: SmoothPageIndicator(
          onDotClicked: (index) => pageIndexNotifier.value = index,
          count: length,
          controller: _pageController,
          effect: WormEffect(
            activeDotColor: Colors.black,
            dotHeight: 6.0,
            dotColor: Colors.black45,
            dotWidth: 6.0,
          ),
        ),
      ),
    );
  }
}
