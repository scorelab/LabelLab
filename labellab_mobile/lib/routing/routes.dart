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
  static const detailProject = "/project/detail/:id";
  static const addMemberProject = "/project/:id/add";
  static const moreImagesProject = "/project/:id/images";

  // Image
  static const uploadImage = "/project/:project_id/upload";
  static const viewImage = "/project/:project_id/view/:image_id";
  static const labelImage = "/project/:project_id/label/:image_id";

  // Image Path
  static const viewPath = "/project/:project_id/path/:image_id";

  // Group
  static const viewGroup = "/project/:project_id/group/:group_id";

  // Classify
  static const classify = "/classify/:by";
  static const classification = "/classification/:id";

  static void configureRouter(Router router) {
    router.define(main, handler: mainHandler);
    router.define(login,
        handler: loginHandler, transitionType: TransitionType.native);
    router.define(signup,
        handler: signupHandler, transitionType: TransitionType.native);
    router.define(profile,
        handler: profileHandler, transitionType: TransitionType.native);

    router.define(addProject,
        handler: addProjectHandler, transitionType: TransitionType.native);
    router.define(editProject,
        handler: editProjectHandler, transitionType: TransitionType.native);
    router.define(detailProject,
        handler: detailProjectHandler, transitionType: TransitionType.native);
    router.define(addMemberProject,
        handler: addMemberProjectHandler,
        transitionType: TransitionType.native);
    router.define(moreImagesProject,
        handler: moreImagesProjectHandler,
        transitionType: TransitionType.native);

    router.define(uploadImage,
        handler: uploadImageHandler, transitionType: TransitionType.native);
    router.define(viewImage,
        handler: viewImageHandler, transitionType: TransitionType.native);
    router.define(labelImage,
        handler: labelImageHandler, transitionType: TransitionType.native);

    router.define(viewPath,
        handler: viewPathHandler, transitionType: TransitionType.native);

    router.define(viewGroup,
        handler: viewGroupHandler, transitionType: TransitionType.native);

    router.define(classify,
        handler: classifyHandler, transitionType: TransitionType.native);
    router.define(classification,
        handler: classificationHandler, transitionType: TransitionType.native);
  }
}
