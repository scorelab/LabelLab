import 'package:fluro/fluro.dart';
import 'package:labellab_mobile/routing/route_handler.dart';

class Routes {
  static const home = "/";

  static void configureRouter(Router router) {
    router.define(home, handler: homeHandler);
  }
}
