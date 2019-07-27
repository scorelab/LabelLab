import 'dart:io';

import 'package:labellab_mobile/data/remote/dto/google_user_request.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/dto/register_response.dart';
import 'package:labellab_mobile/model/api_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/model/image.dart';
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
  Future<ApiResponse> uploadUserImage(String token, File image);

  // Project
  Future<List<Project>> getProjects(String token);
  Future<Project> getProject(String token, String id);
  Future<ApiResponse> createProject(String token, Project project);
  Future<ApiResponse> updateProject(String token, Project project);
  Future<ApiResponse> deleteProject(String token, String id);

  // Image
  Future<ApiResponse> uploadImage(String token, String projectId, UploadImage image);
  Future<Image> getImage(String token, String imageId);
  Future<ApiResponse> deleteImage(String token, String imageId);

  // Classification
  Future<Classification> classify(String token, File image);
  Future<List<Classification>> getClassifications(String token);
  Future<Classification> getClassification(String token, String id);
  Future<ApiResponse> deleteClassification(String token, String id);
}