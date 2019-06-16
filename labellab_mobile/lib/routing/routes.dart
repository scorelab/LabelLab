import 'package:fluro/fluro.dart';
import 'package:labellab_mobile/routing/route_handler.dart';

class Routes {
  static const main = "/";
  static const login = "/login";
  static const signup = "/signup";
  static const profile = "/profile";

  // Project
  static const addProject = "/project/add";
  static const editProject = "/project/edit/:id";

  static void configureRouter(Router router) {
    router.define(main, handler: mainHandler);
    router.define(login, handler: loginHandler, transitionType: TransitionType.native);
    router.define(signup, handler: signupHandler, transitionType: TransitionType.native);
    router.define(profile, handler: profileHandler, transitionType: TransitionType.native);
    router.define(profile, handler: profileHandler, transitionType: TransitionType.native);
    router.define(addProject, handler: addProjectHandler, transitionType: TransitionType.native);
    router.define(editProject, handler: editProjectHandler, transitionType: TransitionType.native);
  }
}
