import 'package:fluro/fluro.dart';
import 'package:labellab_mobile/routing/route_handler.dart';

class Routes {
  static const main = "/";

  static void configureRouter(Router router) {
    router.define(main, handler: mainHandler);
  }
}
