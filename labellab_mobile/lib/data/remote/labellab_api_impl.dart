import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/config.dart';
import 'package:labellab_mobile/data/remote/dto/google_user_request.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/dto/register_response.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/model/api_response.dart';
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

class LabelLabAPIImpl extends LabelLabAPI {
  Dio _dio;

  LabelLabAPIImpl() : _dio = Dio();

  /// BASE_URL - Change according to current labellab server
  static const String BASE_URL = API_BASE_URL;

  static const String API_URL = BASE_URL + "api/v1/";
  static const String STATIC_CLASSIFICATION_URL =
      BASE_URL + "static/classifications/";
  static const String STATIC_IMAGE_URL = BASE_URL + "static/img/";
  static const String STATIC_UPLOADS_URL = BASE_URL + "static/uploads/";

  // Endpoints
  static const ENDPOINT_LOGIN = "auth/login";
  static const ENDPOINT_LOGIN_GOOGLE = "auth/google/mobile";
  static const ENDPOINT_LOGIN_GITHUB = "auth/github";
  static const ENDPOINT_REGISTER = "auth/register";

  static const ENDPOINT_USERS_INFO = "users/info";
  static const ENDPOINT_USERS_SEARCH = "users/search";
  static const ENDPOINT_UPLOAD_USER_IMAGE = "users/upload_image";

  static const ENDPOINT_PROJECT_GET = "project/get";
  static const ENDPOINT_PROJECT_CREATE = "project/create";
  static const ENDPOINT_PROJECT_UPDATE = "project/update";
  static const ENDPOINT_PROJECT_DELETE = "project/delete";
  static const ENDPOINT_PROJECT_ADD_MEMBER = "project/add";
  static const ENDPOINT_PROJECT_REMOVE_MEMBER = "project/remove";

  static const ENDPOINT_IMAGE = "image";

  static const ENDPOINT_GROUP = "group";

  static const ENDPOINT_LABEL = "label";

  static const ENDPOINT_PATH = "path";

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
    }).catchError((err) {
      print(err);
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
        return User.fromJson(response.data['body'],
            imageEndpoint: STATIC_IMAGE_URL);
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<List<User>> searchUser(String token, String email) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_USERS_SEARCH + "/$email", options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return (response.data['body'] as List)
            .map((user) => User.fromJson(user, imageEndpoint: STATIC_IMAGE_URL))
            .toList();
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<ApiResponse> uploadUserImage(String token, File image) {
    final imageBytes = image.readAsBytesSync();
    final encodedBytes = base64Encode(imageBytes);
    final data = {"image": "base64," + encodedBytes, "format": "image/jpg"};
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
      // contentType: ContentType.parse("application/x-www-form-urlencoded"),
    );
    return _dio
        .post(API_URL + ENDPOINT_UPLOAD_USER_IMAGE,
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
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
        final project = Project.fromJson(response.data['body'],
            imageEndpoint: STATIC_UPLOADS_URL);
        return project;
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
        return (response.data['body']['project'] as List<dynamic>)
            .map((item) => Project.fromJson(item, isDense: true))
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
  Future<ApiResponse> deleteProject(String token, String id) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .delete(API_URL + ENDPOINT_PROJECT_DELETE + "/$id", options: options)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> addMember(String token, String projectId, String email) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    final data = {
      "memberEmail": email,
    };
    return _dio
        .post(API_URL + ENDPOINT_PROJECT_ADD_MEMBER + "/$projectId",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> removeMember(
      String token, String projectId, String email) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    final data = {
      "memberEmail": email,
    };
    return _dio
        .post(API_URL + ENDPOINT_PROJECT_REMOVE_MEMBER + "/$projectId",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> uploadImage(
      String token, String projectId, UploadImage image) async {
    final imageBytes = image.image.readAsBytesSync();
    final encodedBytes = base64Encode(imageBytes);

    final takenAt = (image.metadata != null &&
            image.metadata.exif != null &&
            image.metadata.exif.dateTime != null)
        ? image.metadata.exif.dateTime
        : "";
    final latitude = (image.metadata != null &&
            image.metadata.gps != null &&
            image.metadata.gps.gpsLatitude != null)
        ? image.metadata.gps.gpsLatitude
        : "";
    final longitude = (image.metadata != null &&
            image.metadata.gps != null &&
            image.metadata.gps.gpsLongitude != null)
        ? image.metadata.gps.gpsLongitude
        : "";

    final data = {
      "projectId": projectId,
      "imageNames": ["Image"],
      "images": ["base64," + encodedBytes],
      "format": "image/jpg",
      "metadata": {
        "takenAt": takenAt,
        "latitude": latitude,
        "longitude": longitude
      }
    };
    Options options =
        Options(headers: {HttpHeaders.authorizationHeader: "Bearer " + token});
    return _dio
        .post(API_URL + ENDPOINT_IMAGE + "/$projectId/create",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<Image> getImage(String token, String id) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_IMAGE + "/$id/get", options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        final image = Image.fromJson(response.data['body'],
            imageEndpoint: STATIC_UPLOADS_URL);
        return image;
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<ApiResponse> updateImage(
      String token, Image image, List<LabelSelection> selections) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    final data = {
      "labels": selections.map((selection) {
        return selection.toMap();
      }).toList(),
      "width": image.width,
      "height": image.height,
    };
    return _dio
        .put(API_URL + ENDPOINT_IMAGE + "/${image.id}/update",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> deleteImage(String token, String imageId) {
    final data = {
      "images": [imageId]
    };
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .delete(API_URL + ENDPOINT_IMAGE + "/delete",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> deleteImages(String token, List<String> imageIds) {
    final data = {"images": imageIds};
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .delete(API_URL + ENDPOINT_IMAGE + "/delete",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<List<Location>> getImagePath(String token, String imageId) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );

    return _dio
        .get(API_URL + ENDPOINT_IMAGE + "/$imageId/" + ENDPOINT_PATH,
            options: options)
        .then(
          (response) => response.data['data']
              .map((location) => Location.fromJson(location))
              .toList(),
        );
  }

  @override
  Future<ApiResponse> createGroup(String token, String projectId, Group group) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    final data = {
      "group": group.toMap(),
    };
    return _dio
        .post(API_URL + ENDPOINT_GROUP + "/$projectId/create",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> updateGroup(String token, Group group) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .put(API_URL + ENDPOINT_GROUP + "/${group.id}/update",
            options: options, data: group.toMap())
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<Group> getGroup(String token, String id) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_GROUP + "/$id/get", options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return Group.fromJson(response.data['body']);
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<List<Label>> getLabels(String token, String projectId) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_LABEL + "/$projectId/get", options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return (response.data['body']['labels'] as List<dynamic>)
            .map((item) => Label.fromJson(item))
            .toList();
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<ApiResponse> createLabel(String token, String projectId, Label label) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    final data = {
      "label": label.toMap(),
    };
    return _dio
        .post(API_URL + ENDPOINT_LABEL + "/$projectId/create",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> updateLabel(String token, Label label) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .put(API_URL + ENDPOINT_LABEL + "/${label.id}/update",
            options: options, data: label.toMap())
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> deleteLabel(String token, String id) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .delete(API_URL + ENDPOINT_LABEL + "/$id/delete", options: options)
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
      // contentType: ContentType.parse("application/x-www-form-urlencoded"),
    );
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
