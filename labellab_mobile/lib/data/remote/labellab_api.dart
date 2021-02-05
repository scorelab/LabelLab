import 'dart:io';

import 'package:labellab_mobile/data/remote/dto/google_user_request.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/dto/refresh_response.dart';
import 'package:labellab_mobile/data/remote/dto/register_response.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/model/group.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/label_selection.dart';
import 'package:labellab_mobile/model/location.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/upload_image.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:labellab_mobile/screen/train/dialogs/dto/model_dto.dart';

abstract class LabelLabAPI {
  Future<LoginResponse> login(AuthUser user);
  Future<RefreshResponse> refreshToken(String refreshToken);
  Future<LoginResponse> loginWithGoogle(GoogleUserRequest user);
  Future<LoginResponse> loginWithGithub(String code);
  Future<RegisterResponse> register(RegisterUser user);

  // Profile
  Future<User> usersInfo(String token);
  Future<List<User>> searchUser(String token, String email);
  Future<ApiResponse> uploadUserImage(String token, File image);
  Future<ApiResponse> editInfo(String token, String username);

  // Project
  Future<List<Project>> getProjects(String token);
  Future<Project> getProject(String token, String id);
  Future<ApiResponse> createProject(String token, Project project);
  Future<ApiResponse> updateProject(String token, Project project);
  Future<ApiResponse> deleteProject(String token, String id);
  Future<ApiResponse> addMember(String token, String projectId, String email);
  Future<ApiResponse> removeMember(
      String token, String projectId, String email);

  // Image
  Future<ApiResponse> uploadImage(
      String token, String projectId, UploadImage image);
  Future<List<Image>> getImages(String token, String projectId);
  Future<Image> getImage(String token, String imageId);
  Future<ApiResponse> updateImage(String token, String projectId, Image image,
      List<LabelSelection> selections);
  Future<ApiResponse> deleteImage(
      String token, String projectId, String imageId);
  Future<ApiResponse> deleteImages(
      String token, String projectId, List<String> imageIds);
  Future<List<Location>> getImagesPath(
      String token, String projectId, List<String> ids);

  // Group
  Future<ApiResponse> createGroup(String token, String projectId, Group group);
  Future<ApiResponse> addGroupImages(
      String token, String projectId, String groupId, List<String> images);
  Future<ApiResponse> updateGroup(String token, Group group);
  Future<Group> getGroup(String token, String groupId);

  // Label
  Future<List<Label>> getLabels(String token, String projectId);
  Future<ApiResponse> createLabel(String token, String projectId, Label label);
  Future<ApiResponse> updateLabel(String token, String projectId, Label label);
  Future<ApiResponse> deleteLabel(
      String token, String projectId, String labelId);

  // Classification
  Future<Classification> classify(String token, File image);
  Future<List<Classification>> getClassifications(String token);
  Future<Classification> getClassification(String token, String id);
  Future<ApiResponse> deleteClassification(String token, String id);

  // Train
  Future<List<MlModel>> getModels(String token, String projectId);
  Future<MlModel> getModel(String token, String modelId);
  Future<List<MlModel>> getTrainedModels(String token, String projectId);
  Future<ApiResponse> createModel(
      String token, String projectId, MlModel model);
  Future<ApiResponse> saveModel(
      String token, String modelId, MlModel model, ModelDto modelDto);
  Future<ApiResponse> trainModel(String token, String modelId);
  Future<List<charts.Series>> getResults(String token);
}
