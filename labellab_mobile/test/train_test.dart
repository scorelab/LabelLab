import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/model/ml_model.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';
import 'package:labellab_mobile/screen/train/dialogs/dto/model_dto.dart';

import 'mock_labellab_api.dart';

// Parameters
final String token = 'token';
final String projectId = 'project_id';
final String modelId = 'model_id';
final MlModel model = MlModel();
final Map<String, dynamic> jsonData = {'test': true};
final ModelDto modelDto = ModelDto();

// This file covers tests for all train endpoints
@GenerateMocks([LabelLabAPI])
void main() {
  final mockAPI = MockLabelLabAPI();

  setUp(() {});

  tearDown(() {});

  test('Get models', () async {
    when(mockAPI.getModels(token, projectId))
        .thenAnswer((realInvocation) async => List<MlModel>.empty());

    expect(
      await mockAPI.getModels(token, projectId),
      isA<List<MlModel>>(),
    );
  });

  test('Get model', () async {
    when(mockAPI.getModel(token, modelId))
        .thenAnswer((realInvocation) async => MlModel());

    expect(
      await mockAPI.getModel(token, modelId),
      isA<MlModel>(),
    );
  });

  test('Get trained models', () async {
    when(mockAPI.getTrainedModels(token, projectId))
        .thenAnswer((realInvocation) async => List<MlModel>.empty());

    expect(
      await mockAPI.getTrainedModels(token, projectId),
      isA<List<MlModel>>(),
    );
  });

  test('Create model', () async {
    when(mockAPI.createModel(token, projectId, model))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
        await mockAPI.createModel(token, projectId, model), isA<ApiResponse>());
  });

  test('Update model', () async {
    when(mockAPI.updateModel(token, projectId, model))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
        await mockAPI.updateModel(token, projectId, model), isA<ApiResponse>());
  });

  test('Delete model', () async {
    when(mockAPI.deleteModel(token, modelId))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.deleteModel(token, modelId), isA<ApiResponse>());
  });

  test('Train model', () async {
    when(mockAPI.trainModel(token, modelId))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.trainModel(token, modelId), isA<ApiResponse>());
  });

  test('Save model', () async {
    when(mockAPI.saveModel(token, modelId, model, modelDto))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.saveModel(token, modelId, model, modelDto),
        isA<ApiResponse>());
  });
}
