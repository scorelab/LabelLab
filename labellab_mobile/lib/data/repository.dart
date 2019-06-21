import 'dart:io';

import 'package:labellab_mobile/data/local/classifcation_provider.dart';
import 'package:labellab_mobile/data/local/project_provider.dart';
import 'package:labellab_mobile/data/local/user_provider.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/labellab_api_impl.dart';
import 'package:labellab_mobile/model/api_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
    return _api.login(user).then((response) {
      this.accessToken = response.token;
      SharedPreferences.getInstance().then((pref) {
        pref.setString("token", response.token);
      });
      return response;
    });
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
      if (response.err_field == null) {
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

  Future<bool> deleteClassification(String id) {
    if (accessToken == null) return Future(null);
    return _api.deleteClassification(accessToken, id).then((res) {
      return _classificationProvider.delete(id).then((_) => res.success);
    });
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
