import 'dart:convert';
import 'dart:io';

import 'package:charts_common/src/data/series.dart';
import 'package:dio/dio.dart';
import 'package:labellab_mobile/config.dart';
import 'package:labellab_mobile/data/interceptor/token_interceptor.dart';
import 'package:labellab_mobile/data/remote/dto/google_user_request.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/dto/refresh_response.dart';
import 'package:labellab_mobile/data/remote/dto/register_response.dart';
import 'package:labellab_mobile/data/remote/fake_server/fake_server.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/model/group.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/label_selection.dart';
import 'package:labellab_mobile/model/location.dart';
import 'package:labellab_mobile/model/mapper/ml_model_mapper.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/upload_image.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/model_dto.dart';
import 'package:logger/logger.dart';

class LabelLabAPIImpl extends LabelLabAPI {
  Dio _dio;
  FakeServer _fake;

  LabelLabAPIImpl() {
    _dio = Dio();
    _fake = FakeServer();

    _dio.interceptors.clear();
    _dio.interceptors.add(RetryOnAuthFailInterceptor(_dio));
  }

  /// BASE_URL - Change according to current labellab server
  static const String BASE_URL = API_BASE_URL;

  static const String API_URL = BASE_URL + "api/v1/";
  static const String STATIC_CLASSIFICATION_URL =
      BASE_URL + "static/uploads/classifications/";
  static const String STATIC_IMAGE_URL = BASE_URL + "static/img/";
  static const String STATIC_UPLOADS_URL = BASE_URL + "static/uploads/";

  // Endpoints
  static const ENDPOINT_LOGIN = "auth/login";
  static const ENDPOINT_REFRESH = "auth/token_refresh";
  static const ENDPOINT_LOGIN_GOOGLE = "auth/google/mobile";
  static const ENDPOINT_LOGIN_GITHUB = "auth/github";
  static const ENDPOINT_REGISTER = "auth/register";

  static const ENDPOINT_USERS_INFO = "users/info";
  static const ENDPOINT_USERS_SEARCH = "users/search";
  static const ENDPOINT_UPLOAD_USER_IMAGE = "users/upload_image";

  static const ENDPOINT_PROJECT_GET = "project/get";
  static const ENDPOINT_PROJECT_INFO = "project/project_info";
  static const ENDPOINT_PROJECT_CREATE = "project/create";
  static const ENDPOINT_PROJECT_UPDATE = "project/project_info";
  static const ENDPOINT_PROJECT_DELETE = "project/project_info";
  static const ENDPOINT_PROJECT_ADD_MEMBER = "project/add";
  static const ENDPOINT_PROJECT_REMOVE_MEMBER = "project/remove";

  static const ENDPOINT_IMAGE = "image";
  static const ENDPOINT_IMAGES = "images";
  static const ENDPOINT_METADATA = "metadata";

  static const ENDPOINT_GROUP = "group";

  static const ENDPOINT_LABEL = "label";

  static const ENDPOINT_PATH = "path";

  static const ENDPOINT_CLASSIFICAITON_CLASSIFY = "classification/classify";
  static const ENDPOINT_CLASSIFICATION_GET = "classification/get";
  static const ENDPOINT_CLASSIFICATION_ALL = "classification/all";
  static const ENDPOINT_CLASSIFICATION_DELETE = "classification/delete";

  static const ENDPOINT_ML_CLASSIFIER = "mlclassifier";

  @override
  Future<LoginResponse> login(AuthUser user) {
    return _dio
        .post(API_URL + ENDPOINT_LOGIN, data: user.toMap())
        .then((response) {
      return LoginResponse(response.data);
    }).catchError((err) =>
            throw new Exception(jsonDecode(err.response.toString())['msg']));
  }

  @override
  Future<RefreshResponse> refreshToken(String refreshToken) {
    Options options = Options(
        headers: {HttpHeaders.authorizationHeader: "Bearer " + refreshToken});

    return _dio
        .post(API_URL + ENDPOINT_REFRESH, options: options)
        .then((response) => RefreshResponse(response.data))
        .catchError((err) {
      Logger().e(err);
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
    }).catchError((err) =>
            throw new Exception(jsonDecode(err.response.toString())['msg']));
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
        .get(API_URL + ENDPOINT_PROJECT_INFO + "/$id", options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        Project project = Project.fromJson(response.data['body'],
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
        return (response.data['body'] as List<dynamic>)
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
    // final imageBytes = image.image.readAsBytesSync();
    // final encodedBytes = base64Encode(imageBytes);

    // final takenAt = (image.metadata != null &&
    //         image.metadata.exif != null &&
    //         image.metadata.exif.dateTime != null)
    //     ? image.metadata.exif.dateTime
    //     : "";
    // final latitude = (image.metadata != null &&
    //         image.metadata.gps != null &&
    //         image.metadata.gps.gpsLatitude != null)
    //     ? image.metadata.gps.gpsLatitude
    //     : "";
    // final longitude = (image.metadata != null &&
    //         image.metadata.gps != null &&
    //         image.metadata.gps.gpsLongitude != null)
    //     ? image.metadata.gps.gpsLongitude
    //     : "";

    // final data = {
    //   "projectId": projectId,
    //   "imageNames": ["Image"],
    //   "images": ["base64," + encodedBytes],
    //   "format": "image/jpg",
    //   "metadata": {
    //     "takenAt": takenAt,
    //     "latitude": latitude,
    //     "longitude": longitude
    //   }
    // };

    FormData data = FormData.fromMap(
        {"images": await MultipartFile.fromFile(image.image.path)});

    Options options =
        Options(headers: {HttpHeaders.authorizationHeader: "Bearer " + token});
    return _dio
        .post(API_URL + ENDPOINT_IMAGE + "/create/$projectId",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<List<Image>> getImages(String token, String projectId) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_IMAGE + "/get/$projectId", options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return (response.data['body'] as List<dynamic>)
            .map((image) => Image.fromJson(image))
            .toList();
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<Image> getImage(String token, String id) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_IMAGE + "/get_image/$id", options: options)
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
  Future<ApiResponse> updateImage(String token, String projectId, Image image,
      List<LabelSelection> selections) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    final data = {
      "project_id": projectId,
      "labelled": true,
      "labels": selections.map((selection) {
        return selection.toMap();
      }).toList(),
      "width": image.width,
      "height": image.height,
    };
    return _dio
        .put(API_URL + ENDPOINT_IMAGE + "/update/${image.id}",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> deleteImage(
      String token, String projectId, String imageId) {
    final data = {
      "images": [imageId]
    };
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .post(API_URL + ENDPOINT_IMAGE + "/delete/$projectId",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> deleteImages(
      String token, String projectId, List<String> imageIds) {
    final data = {"images": imageIds};
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .post(API_URL + ENDPOINT_IMAGE + "/delete/$projectId",
            options: options, data: data)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<List<Location>> getImagesPath(
      String token, String projectId, List<String> ids) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );

    return _dio
        .post(
            API_URL + ENDPOINT_IMAGES + "/" + ENDPOINT_METADATA + "/$projectId",
            options: options)
        .then((response) {
      final bool isSuccess = response.data["success"];
      if (isSuccess) {
        return (response.data['body'] as List<dynamic>)
            .map((meta) => Location.fromJson(meta))
            .toList();
      } else {
        throw Exception("Request Failed");
      }
    });
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
  Future<ApiResponse> addGroupImages(
      String token, String projectId, String groupId, List<String> images) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .put(API_URL + ENDPOINT_GROUP + "/$groupId/add-images",
            options: options, data: images)
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
    // Options options = Options(
    //   headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    // );
    // return _dio
    //     .get(API_URL + ENDPOINT_GROUP + "/$id/get", options: options)
    //     .then((response) {
    //   final bool isSuccess = response.data['success'];
    //   if (isSuccess) {
    //     return Group.fromJson(response.data['body']);
    //   } else {
    //     throw Exception("Request unsuccessfull");
    //   }
    // });

    return Future.delayed(Duration(seconds: 1)).then((value) => _fake.getGroup);
  }

  @override
  Future<List<Label>> getLabels(String token, String projectId) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_LABEL + "/get/$projectId", options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return (response.data['body'] as List<dynamic>)
            .map((item) => Label.fromJson(item))
            .toList();
      } else {
        return List.from([]);
        // throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<ApiResponse> createLabel(String token, String projectId, Label label) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .post(API_URL + ENDPOINT_LABEL + "/create/$projectId",
            options: options, data: label.toMap())
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> updateLabel(String token, String projectId, Label label) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .put(API_URL + ENDPOINT_LABEL + "/label_info/${label.id}/$projectId",
            options: options, data: label.toMap())
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> deleteLabel(
      String token, String projectId, String labelId) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .delete(API_URL + ENDPOINT_LABEL + "/label_info/$labelId/$projectId",
            options: options)
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<Classification> classify(String token, File image) async {
    Options options =
        Options(headers: {HttpHeaders.authorizationHeader: "Bearer " + token});

    FormData data =
        FormData.fromMap({"image": await MultipartFile.fromFile(image.path)});

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
        return Classification.fromJson(response.data['body'],
            staticEndpoint: STATIC_CLASSIFICATION_URL);
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
        .get(API_URL + ENDPOINT_CLASSIFICATION_ALL, options: options)
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

  @override
  Future<List<Series>> getResults(String token) {
    return Future.delayed(Duration(seconds: 2))
        .then((value) => _fake.getResults);
  }

  @override
  Future<List<MlModel>> getModels(String token, String projectId) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_ML_CLASSIFIER + "/all/$projectId",
            options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return (response.data['body'] as List<dynamic>)
            .map((model) => MlModel.fromJson(model))
            .toList();
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<List<MlModel>> getTrainedModels(String token, String projectId) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_ML_CLASSIFIER + "/trained/$projectId",
            options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return (response.data['body'] as List<dynamic>)
            .map((model) => MlModel.fromJson(model))
            .toList();
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<MlModel> getModel(String token, String modelId) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .get(API_URL + ENDPOINT_ML_CLASSIFIER + "/$modelId", options: options)
        .then((response) {
      final bool isSuccess = response.data['success'];
      if (isSuccess) {
        return MlModel.fromJson(response.data["body"]);
      } else {
        throw Exception("Request unsuccessfull");
      }
    });
  }

  @override
  Future<ApiResponse> createModel(
      String token, String projectId, MlModel model) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    model.projectId = projectId;
    return _dio
        .post(API_URL + ENDPOINT_ML_CLASSIFIER,
            options: options, data: model.toMap())
        .then((response) {
      return ApiResponse(response.data);
    });
  }

  @override
  Future<ApiResponse> saveModel(
      String token, String modelId, MlModel model, ModelDto modelDto) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    Map<String, dynamic> _data = {
      "id": int.parse(modelId),
      "accuracyGraphUrl": model.accuracyGraphUrl,
      "batchSize": modelDto.batchSize,
      "epochs": modelDto.epochs,
      "labels": model.labels,
      "layersJsonUrl": model.layersUrl,
      "learningRate": modelDto.learningRate,
      "loss": modelDto.loss,
      "lossGraphUrl": model.lossGraphUrl,
      "metric": MlModelMapper.metricToString(modelDto.metric),
      "name": model.name,
      "optimizer": MlModelMapper.optimizerToString(modelDto.optimizer),
      "preprocessingStepsJsonUrl": model.preprocessingUrl,
      "projectId": model.projectId,
      "savedModelUrl": model.saveModelUrl,
      "source": MlModelMapper.sourceToString(model.source),
      "test": modelDto.test,
      "train": modelDto.train,
      "transferSource": MlModelMapper.learnToString(modelDto.modelToLearn),
      "type": MlModelMapper.typeToString(model.type),
      "validation": modelDto.validation,
      "preprocessingSteps": modelDto.steps.map((step) {
        switch (step.step) {
          case ModelStep.CENTER:
          case ModelStep.STDNORM:
            return {
              "name": MlModelMapper.stepToString(step.step),
              "settings": [
                {"name": "Type", "value": step.extra}
              ]
            };

          case ModelStep.RR:
          case ModelStep.WSR:
          case ModelStep.HSR:
          case ModelStep.SR:
          case ModelStep.ZR:
          case ModelStep.CSR:
            return {
              "name": MlModelMapper.stepToString(step.step),
              "settings": [
                {"name": "Range", "value": step.extra}
              ]
            };

          case ModelStep.RESCALE:
            return {
              "name": MlModelMapper.stepToString(step.step),
              "settings": [
                {"name": "Factor", "value": step.extra}
              ]
            };

          default:
            return {
              "name": MlModelMapper.stepToString(step.step),
              "settings": []
            };
        }
      }).toList(),
      "layers": modelDto.layers.map((layer) {
        switch (layer.layer) {
          case ModelLayer.C2D:
            return {
              "name": MlModelMapper.layerToString(layer.layer),
              "settings": [
                {"name": "Filters", "value": layer.args[0]},
                {"name": "Kernel Size", "value": layer.args[1]},
                {"name": "X Strides", "value": layer.args[2]},
                {"name": "Y Strides", "value": layer.args[3]}
              ]
            };

          case ModelLayer.ACTIVATION:
            return {
              "name": MlModelMapper.layerToString(layer.layer),
              "settings": [
                {"name": "Activation", "value": layer.args.first}
              ]
            };

          case ModelLayer.MAXPOOL2D:
            return {
              "name": MlModelMapper.layerToString(layer.layer),
              "settings": [
                {"name": "Pool Size X", "value": layer.args.first},
                {"name": "Pool Size Y", "value": layer.args.last}
              ]
            };

          case ModelLayer.DENSE:
            return {
              "name": MlModelMapper.layerToString(layer.layer),
              "settings": [
                {"name": "Units", "value": layer.args.first}
              ]
            };

          case ModelLayer.DROPOUT:
            return {
              "name": MlModelMapper.layerToString(layer.layer),
              "settings": [
                {"name": "Rate", "value": layer.args.first}
              ]
            };

          default:
            return {
              "name": MlModelMapper.layerToString(layer.layer),
              "settings": []
            };
        }
      }).toList()
    };
    return _dio
        .put(API_URL + ENDPOINT_ML_CLASSIFIER + "/$modelId",
            options: options, data: _data)
        .then((response) {
      return ApiResponse(response.data);
    }).catchError((error) => ApiResponse.error(error));
  }

  @override
  Future<ApiResponse> trainModel(String token, String modelId) {
    Options options = Options(
      headers: {HttpHeaders.authorizationHeader: "Bearer " + token},
    );
    return _dio
        .post(API_URL + ENDPOINT_ML_CLASSIFIER + "/train/$modelId",
            options: options)
        .then((response) {
      return ApiResponse(response.data);
    }).catchError((error) => ApiResponse.error(error));
  }
}
