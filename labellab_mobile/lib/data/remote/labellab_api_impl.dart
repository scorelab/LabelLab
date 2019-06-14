import 'dart:io';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/dto/register_response.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/model/api_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/user.dart';

class LabelLabAPIImpl extends LabelLabAPI {
  Dio _dio;

  LabelLabAPIImpl(): _dio = Dio();

  /// BASE_URL - Change according to current labellab server
  static const String BASE_URL = "https://labellab-server.herokuapp.com/api/v1/";

  // Endpoints
  static const ENDPOINT_LOGIN = "auth/login";
  static const ENDPOINT_REGISTER = "auth/register";
  static const ENDPOINT_USERS_INFO = "users/info";

  static const ENDPOINT_PROJECT_GET = "project/get";
  static const ENDPOINT_PROJECT_CREATE = "project/create";
  static const ENDPOINT_PROJECT_UPDATE = "project/update";
  
  @override
  Future<LoginResponse> login(AuthUser user) {
    return _dio.post(BASE_URL + ENDPOINT_LOGIN, data: user.toMap()).then((response) {
      return LoginResponse(response.data);
    });
  }

  @override
  Future<RegisterResponse> register(RegisterUser user) {
    return _dio.post(BASE_URL + ENDPOINT_REGISTER, data: user.toMap()).then((response) {
      return RegisterResponse(response.data);
    });
  }

  @override
  Future<User> usersInfo(String token) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio.get(BASE_URL + ENDPOINT_USERS_INFO, options: options).then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return User.fromJson(response.data['body']);
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<ApiResponse> createProject(String token, Project project) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio.post(BASE_URL + ENDPOINT_PROJECT_CREATE, options: options, data: project.toMap()).then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<Project> getProject(String token, String id) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio.get(BASE_URL + ENDPOINT_PROJECT_GET + "/$id", options: options).then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return Project.fromJson(response.data['body']);
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<List<Project>> getProjects(String token) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio.get(BASE_URL + ENDPOINT_PROJECT_GET, options: options).then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return (response.data['body'] as List<dynamic>)
        .map((item) => Project.fromJson(item))
        .toList();
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<ApiResponse> updateProject(String token, Project project) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio.put(BASE_URL + ENDPOINT_PROJECT_UPDATE, options: options, data: project.toMap()).then((response) {
      return ApiResponse(response.data);
    });
  }
  
}