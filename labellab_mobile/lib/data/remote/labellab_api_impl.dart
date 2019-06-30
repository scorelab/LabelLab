import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/remote/dto/google_user_request.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/dto/register_response.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/model/api_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/user.dart';

class LabelLabAPIImpl extends LabelLabAPI {
  Dio _dio;

  LabelLabAPIImpl() : _dio = Dio();

  /// BASE_URL - Change according to current labellab server
  static const String BASE_URL = "https://labellab-server.herokuapp.com/";

  static const String API_URL = BASE_URL + "api/v1/";
  static const String STATIC_CLASSIFICATION_URL =
      BASE_URL + "static/classifications/";
  static const String STATIC_IMAGE_URL = BASE_URL + "static/classifications/";

  // Endpoints
  static const ENDPOINT_LOGIN = "auth/login";
  static const ENDPOINT_LOGIN_GOOGLE = "auth/google/mobile";
  static const ENDPOINT_LOGIN_GITHUB = "auth/github";
  static const ENDPOINT_REGISTER = "auth/register";
  static const ENDPOINT_USERS_INFO = "users/info";

  static const ENDPOINT_PROJECT_GET = "project/get";
  static const ENDPOINT_PROJECT_CREATE = "project/create";
  static const ENDPOINT_PROJECT_UPDATE = "project/update";

  static const ENDPOINT_CLASSIFICAITON_CLASSIFY = "classification/classify";
  static const ENDPOINT_CLASSIFICATION_GET = "classification/get";
  static const ENDPOINT_CLASSIFICATION_DELETE = "classification/delete";

  @override
  Future<LoginResponse> login(AuthUser user) {
    return _dio
        .post(API_URL + ENDPOINT_LOGIN, data: user.toMap())
        .then((response) {
      return LoginResponse(response.data);
    });
  }

  @override
  Future<LoginResponse> loginWithGoogle(GoogleUserRequest user) {
    return _dio
        .post(API_URL + ENDPOINT_LOGIN_GOOGLE, data: user.toMap())
        .then((response) {
      return LoginResponse(response.data);
    });
  }

  @override
  Future<LoginResponse> loginWithGithub(String code) {
    return _dio
        .get(API_URL + ENDPOINT_LOGIN_GITHUB + "/callback?code=" + code)
        .then((response) {
      return LoginResponse(response.data);
    });
  }

  @override
  Future<RegisterResponse> register(RegisterUser user) {
    return _dio
        .post(API_URL + ENDPOINT_REGISTER, data: user.toMap())
        .then((response) {
      return RegisterResponse(response.data);
    });
  }

  @override
  Future<User> usersInfo(String token) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_USERS_INFO, options: options)
        .then((response) {
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
    return _dio
        .post(API_URL + ENDPOINT_PROJECT_CREATE,
            options: options, data: project.toMap())
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<Project> getProject(String token, String id) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_PROJECT_GET + "/$id", options: options)
        .then((response) {
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
    return _dio
        .get(API_URL + ENDPOINT_PROJECT_GET, options: options)
        .then((response) {
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
    return _dio
        .put(API_URL + ENDPOINT_PROJECT_UPDATE + "/${project.id}",
            options: options, data: project.toMap())
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<Classification> classify(String token, File image) async {
    final imageBytes = image.readAsBytesSync();
    final encodedBytes = base64Encode(imageBytes);
    final data = {"image": "base64," + encodedBytes, "format": "image/jpg"};
    Options options = Options(
        headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
        contentType: ContentType.parse("application/x-www-form-urlencoded"));
    final response = await _dio.post(API_URL + ENDPOINT_CLASSIFICAITON_CLASSIFY,
        options: options, data: data);
    return Classification.fromJson(response.data['body'],
        staticEndpoint: STATIC_CLASSIFICATION_URL);
  }

  @override
  Future<Classification> getClassification(String token, String id) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_CLASSIFICATION_GET + "/$id", options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return (response.data['body'] as List<dynamic>)
            .map((item) => Classification.fromJson(item,
                staticEndpoint: STATIC_CLASSIFICATION_URL))
            .toList()
            .first;
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<List<Classification>> getClassifications(String token) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_CLASSIFICATION_GET, options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return (response.data['body'] as List<dynamic>)
            .map((item) => Classification.fromJson(item,
                staticEndpoint: STATIC_CLASSIFICATION_URL))
            .toList();
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<ApiResponse> deleteClassification(String token, String id) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .delete(API_URL + ENDPOINT_CLASSIFICATION_DELETE + "/$id",
            options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return ApiResponse(response.data);
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }
}
