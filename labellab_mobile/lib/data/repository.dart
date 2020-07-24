import 'dart:io';

import 'package:labellab_mobile/data/local/classifcation_provider.dart';
import 'package:labellab_mobile/data/local/project_provider.dart';
import 'package:labellab_mobile/data/local/user_provider.dart';
import 'package:labellab_mobile/data/remote/dto/google_user_request.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/labellab_api_impl.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/model/group.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/label_selection.dart';
import 'package:labellab_mobile/model/location.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/upload_image.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:charts_flutter/flutter.dart' as charts;

class Repository {
  LabelLabAPI _api;
  ProjectProvider _projectProvider;
  ClassificationProvider _classificationProvider;
  UserProvider _userProvider;

  String accessToken;

  Future<bool> initToken() {
    return SharedPreferences.getInstance().then((pref) {
      String token = pref.getString("token");
      if (token != null) {
        accessToken = token;
        return true;
      } else {
        return false;
      }
    });
  }

  Future<LoginResponse> login(AuthUser user) {
    return _api.login(user).then((response) => _storeAccessToken(response));
  }

  Future<LoginResponse> loginWithGoogle(GoogleUserRequest user) {
    return _api
        .loginWithGoogle(user)
        .then((response) => _storeAccessToken(response));
  }

  Future<LoginResponse> loginWithGithub(String code) {
    return _api
        .loginWithGithub(code)
        .then((response) => _storeAccessToken(response));
  }

  LoginResponse _storeAccessToken(LoginResponse response) {
    this.accessToken = response.token;
    SharedPreferences.getInstance().then((pref) {
      pref.setString("token", response.token);
    });
    return response;
  }

  Future<void> logout() {
    this.accessToken = null;
    return SharedPreferences.getInstance().then((pref) async {
      pref.setString("token", null);
      await _userProvider.delete();
    });
  }

  Future<LoginResponse> register(RegisterUser user) {
    return _api.register(user).then((response) {
      if (response.errField == null) {
        return login(user);
      } else
        throw Exception(response.msg);
    });
  }

  Future<User> usersInfoLocal() {
    return _userProvider.getUser();
  }

  Future<User> usersInfo() {
    if (accessToken == null) return Future(null);
    return _api.usersInfo(accessToken).then((user) async {
      await _userProvider.insert(user);
      return user;
    });
  }

  Future<List<User>> searchUser(String email) {
    if (accessToken == null) return Future(null);
    return _api.searchUser(accessToken, email);
  }

  Future<ApiResponse> uploadUserImage(File image) {
    if (accessToken == null) return Future(null);
    return _api.uploadUserImage(accessToken, image);
  }

  // Project
  Future<ApiResponse> createProject(Project project) {
    if (accessToken == null) return Future(null);
    return _api.createProject(accessToken, project);
  }

  Future<Project> getProject(String id) {
    if (accessToken == null) return Future(null);
    return _api.getProject(accessToken, id);
  }

  Future<List<Project>> getProjectsLocal() {
    return _projectProvider.open().then((_) {
      return _projectProvider.getProjects().then((projects) {
        _projectProvider.close();
        return projects;
      });
    });
  }

  Future<List<Project>> getProjects() {
    if (accessToken == null) return Future(null);
    return _api.getProjects(accessToken).then((projects) {
      _projectProvider.open().then((_) async {
        await _projectProvider.replaceProjects(projects);
        _projectProvider.close();
      });
      return projects;
    });
  }

  Future<ApiResponse> updateProject(Project project) {
    if (accessToken == null) return Future(null);
    return _api.updateProject(accessToken, project);
  }

  Future<ApiResponse> deleteProject(String id) {
    if (accessToken == null) return Future(null);
    return _api.deleteProject(accessToken, id);
  }

  Future<ApiResponse> addMember(String projectId, String email) {
    if (accessToken == null) return Future(null);
    return _api.addMember(accessToken, projectId, email);
  }

  Future<ApiResponse> removeMember(String projectId, String email) {
    if (accessToken == null) return Future(null);
    return _api.removeMember(accessToken, projectId, email);
  }

  // Image
  Future<ApiResponse> uploadImage(String projectId, UploadImage image) {
    if (accessToken == null) return Future(null);
    return _api.uploadImage(accessToken, projectId, image);
  }

  Future<Image> getImage(String imageId) {
    if (accessToken == null) return Future(null);
    return _api.getImage(accessToken, imageId);
  }

  Future<ApiResponse> updateImage(
      Image image, List<LabelSelection> selections) {
    if (accessToken == null) return Future(null);
    return _api.updateImage(accessToken, image, selections);
  }

  Future<ApiResponse> deleteImage(String imageId) {
    if (accessToken == null) return Future(null);
    return _api.deleteImage(accessToken, imageId);
  }

  Future<ApiResponse> deleteImages(List<String> imageIds) {
    if (accessToken == null) return Future(null);
    return _api.deleteImages(accessToken, imageIds);
  }

  Future<List<Location>> getImagePath(String imageId) {
    if (accessToken == null) return Future(null);
    return _api.getImagePath(accessToken, imageId);
  }

  // Group
  Future<ApiResponse> createGroup(String projectId, Group group) {
    if (accessToken == null) return Future(null);
    return _api.createGroup(accessToken, projectId, group);
  }

  Future<ApiResponse> addGroupImages(
      String projectId, String groupId, List<String> images) {
    if (accessToken == null) return Future(null);
    return _api.addGroupImages(accessToken, projectId, groupId, images);
  }

  Future<ApiResponse> updateGroup(Group group) {
    if (accessToken == null) return Future(null);
    return _api.updateGroup(accessToken, group);
  }

  Future<Group> getGroup(String groupId) {
    if (accessToken == null) return Future(null);
    return _api.getGroup(accessToken, groupId);
  }

  // Label
  Future<ApiResponse> createLabel(String projectId, Label label) {
    if (accessToken == null) return Future(null);
    return _api.createLabel(accessToken, projectId, label);
  }

  Future<List<Label>> getLabels(String projectId) {
    if (accessToken == null) return Future(null);
    return _api.getLabels(accessToken, projectId);
  }

  Future<ApiResponse> updateLabel(Label label) {
    if (accessToken == null) return Future(null);
    return _api.updateLabel(accessToken, label);
  }

  Future<ApiResponse> deleteLabel(String id) {
    if (accessToken == null) return Future(null);
    return _api.deleteLabel(accessToken, id);
  }

  // Classification
  Future<Classification> classify(File image) {
    if (accessToken == null) return Future(null);
    return _api.classify(accessToken, image);
  }

  Future<List<Classification>> getClassifications() {
    if (accessToken == null) return Future(null);
    return _api.getClassifications(accessToken).then((classifications) {
      _classificationProvider.open().then((_) async {
        await _classificationProvider.replaceClassifications(classifications);
        _classificationProvider.close();
      });
      return classifications;
    });
  }

  Future<List<Classification>> getClassificationsLocal() {
    return _classificationProvider.open().then((_) {
      return _classificationProvider
          .getClassifications()
          .then((classifications) {
        _classificationProvider.close();
        return classifications;
      });
    });
  }

  Future<Classification> getClassification(String id) {
    if (accessToken == null) return Future(null);
    return _api.getClassification(accessToken, id);
  }

  Future<Classification> getClassificationLocal(String id) {
    return _classificationProvider.open().then((_) {
      return _classificationProvider
          .getClassification(id)
          .then((classification) {
        _classificationProvider.close();
        return classification;
      });
    });
  }

  Future<bool> deleteClassification(String id) {
    if (accessToken == null) return Future(null);
    return _api.deleteClassification(accessToken, id).then((res) {
      return _classificationProvider.open().then((_) {
        return _classificationProvider.delete(id).then((_) {
          _classificationProvider.close();
          return res.success;
        });
      });
    });
  }

  Future<List<charts.Series>> getResults() {
    if (accessToken == null) return Future(null);
    return _api.getResults(accessToken);
  }

  // Singleton
  static final Repository _respository = Repository._internal();

  factory Repository() {
    return _respository;
  }

  Repository._internal()
      : _api = LabelLabAPIImpl(),
        _projectProvider = ProjectProvider(),
        _classificationProvider = ClassificationProvider(),
        _userProvider = UserProvider();
}
