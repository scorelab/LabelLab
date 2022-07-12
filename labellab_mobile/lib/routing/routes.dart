import 'package:fluro/fluro.dart';
import 'package:labellab_mobile/routing/route_handler.dart';

class Routes {
  static const init = "/";
  static const main = "/main";
  static const login = "/login";
  static const signup = "/signup";
  static const profile = "/profile";
  static const editInfo = "/editinfo/:username";
  static const updatePassword = "/update-password";

  // Project
  static const addProject = "/project/add";
  static const editProject = "/project/edit/:id";
  static const detailProject = "/project/detail/:id";
  static const projectActivity = "/project/activity/:id";
  static const addMemberProject = "/project/:id/add";
  static const moreImagesProject = "/project/:id/images";
  static const entitySpecificProjectActivity =
      "/project/activity/:id/:entity_type/:entity_id";

  // Team
  static const viewTeamDetails = "/project/:project_id/team/:team_id";
  static const teamSpecificProjectActivity = "/team/activity/:id/:category";
  static const viewTeamChatroom = "team/chatroom/:id/:user_id";

  // Image
  static const uploadImage = "/project/:project_id/upload";
  static const viewImage = "/project/:project_id/view/:image_id";
  static const labelImage = "/project/:project_id/label/:image_id";

  // Image Path
  static const viewPath = "/project/:project_id/path/:image_id";

  // Group
  static const viewGroup = "/project/:project_id/group/:group_id";
  static const addGroupImages = "/project/:project_id/group/:group_id/add";

  // Classify
  static const classify = "/classify/:by";
  static const classification = "/classification/:id";

  // Model
  static const train = "/train/:project_id/:model_id";

  // History
  static const modelHistory = "/project/:project_id/history/:model_id";

  // Backend Selection
  static const backendSelection = "/backend-selection";

  //Issues
  static const addIssue = "/issue/add/:project_id";
  static const issueActivity = "/project/issue/:id";

  static void configureRouter(FluroRouter router) {
    router.define(init, handler: initHandler);
    router.define(main, handler: mainHandler);
    router.define(login,
        handler: loginHandler, transitionType: TransitionType.native);
    router.define(signup,
        handler: signupHandler, transitionType: TransitionType.native);
    router.define(updatePassword,
        handler: updatePasswordHandler, transitionType: TransitionType.native);
    router.define(profile,
        handler: profileHandler, transitionType: TransitionType.native);
    router.define(editInfo,
        handler: editInfoHandler, transitionType: TransitionType.native);

    router.define(addProject,
        handler: addProjectHandler, transitionType: TransitionType.native);
    router.define(editProject,
        handler: editProjectHandler, transitionType: TransitionType.native);
    router.define(detailProject,
        handler: detailProjectHandler, transitionType: TransitionType.native);
    router.define(projectActivity,
        handler: projectActivityHandler, transitionType: TransitionType.native);
    router.define(addMemberProject,
        handler: addMemberProjectHandler,
        transitionType: TransitionType.native);
    router.define(moreImagesProject,
        handler: moreImagesProjectHandler,
        transitionType: TransitionType.native);
    router.define(
      teamSpecificProjectActivity,
      handler: teamSpecificProjectActivityHandler,
      transitionType: TransitionType.native,
    );
    router.define(
      entitySpecificProjectActivity,
      handler: entitySpecificProjectActivityHandler,
      transitionType: TransitionType.native,
    );

    router.define(viewTeamDetails,
        handler: viewTeamDetailsHandler, transitionType: TransitionType.native);
    router.define(viewTeamChatroom,
        handler: viewTeamChatroomHandler,
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
    router.define(addGroupImages,
        handler: addGroupImagesHandler, transitionType: TransitionType.native);

    router.define(classify,
        handler: classifyHandler, transitionType: TransitionType.native);
    router.define(classification,
        handler: classificationHandler, transitionType: TransitionType.native);

    router.define(train,
        handler: modelTrainHandler, transitionType: TransitionType.native);
    router.define(modelHistory,
        handler: modelHistoryHandler, transitionType: TransitionType.native);

    router.define(
      backendSelection,
      handler: backendServiceSelectionHandler,
      transitionType: TransitionType.native,
    );

    router.define(
      issueActivity,
      handler: issueActivityHandler,
      transitionType: TransitionType.native,
    );

    router.define(
      addIssue,
      handler: addIssueHandler,
      transitionType: TransitionType.native,
    );
  }
}
