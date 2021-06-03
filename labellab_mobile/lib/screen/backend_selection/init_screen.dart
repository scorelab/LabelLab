import 'package:flutter/material.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/backend_selection/backend_service_selector.dart';

class InitScreen extends StatelessWidget {
  const InitScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<String?>(
        future: BackendServiceSelector().getBackendURLFromLocalStorage(),
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.waiting) {
            String? url = snapshot.data;
            if (url == null) {
              Future.delayed(Duration(milliseconds: 200), () {
                Application.router
                    .navigateTo(context, '/backend-selection', replace: true);
              });
            } else {
              Future.delayed(Duration(milliseconds: 200), () {
                Application.router.navigateTo(context, '/main', replace: true);
              });
            }
          }
          return Container(
            height: MediaQuery.of(context).size.height,
            width: MediaQuery.of(context).size.width,
            child: Image.asset(
              'assets/images/splash.png',
              fit: BoxFit.cover,
            ),
          );
        },
      ),
    );
  }
}
