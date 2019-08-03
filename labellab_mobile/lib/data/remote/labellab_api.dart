import 'dart:io';

import 'package:labellab_mobile/data/remote/dto/google_user_request.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/dto/register_response.dart';
import 'package:labellab_mobile/model/api_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/upload_image.dart';
import 'package:labellab_mobile/model/user.dart';

abstract class LabelLabAPI {
  Future<LoginResponse> login(AuthUser user);
  Future<LoginResponse> loginWithGoogle(GoogleUserRequest user);
  Future<LoginResponse> loginWithGithub(String code);
  Future<RegisterResponse> register(RegisterUser user);

  // Profile
  Future<User> usersInfo(String token);
  Future<User> searchUser(String token, String email);
  Future<ApiResponse> uploadUserImage(String token, File image);

  // Project
  Future<List<Project>> getProjects(String token);
  Future<Project> getProject(String token, String id);
  Future<ApiResponse> createProject(String token, Project project);
  Future<ApiResponse> updateProject(String token, Project project);
  Future<ApiResponse> deleteProject(String token, String id);
  Future<ApiResponse> addMember(String token, String projectId, String email);
  Future<ApiResponse> removeMember(String token, String projectId, String email);

  // Image
  Future<ApiResponse> uploadImage(String token, String projectId, UploadImage image);
  Future<Image> getImage(String token, String imageId);
  Future<ApiResponse> deleteImage(String token, String imageId);

  // Label
  Future<List<Label>> getLabels(String token, String projectId);
  Future<ApiResponse> createLabel(String token, String projectId, Label label);
  Future<ApiResponse> updateLabel(String token, Label label);
  Future<ApiResponse> deleteLabel(String token, String id);

  // Classification
  Future<Classification> classify(String token, File image);
  Future<List<Classification>> getClassifications(String token);
  Future<Classification> getClassification(String token, String id);
  Future<ApiResponse> deleteClassification(String token, String id);
}
