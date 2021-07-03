import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';

import 'mock_labellab_api.dart';

// Parameters
final String token = 'token';
final String labelId = 'label_id';
final String projectId = 'project_id';
final Map<String, dynamic> jsonData = {'test': true};
final Label label = Label();

// This file covers tests for all label endpoints
@GenerateMocks([LabelLabAPI])
void main() {
  final mockAPI = MockLabelLabAPI();

  setUp(() {});

  tearDown(() {});

  test('Get labels', () async {
    when(mockAPI.getLabels(token, projectId))
        .thenAnswer((realInvocation) async => List<Label>.empty());

    expect(
      await mockAPI.getLabels(token, projectId),
      isA<List<Label>>(),
    );
  });

  test('Create label', () async {
    when(mockAPI.createLabel(token, projectId, label))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
      await mockAPI.createLabel(token, projectId, label),
      isA<ApiResponse>(),
    );
  });

  test('Update label', () async {
    when(mockAPI.updateLabel(token, projectId, label))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
        await mockAPI.updateLabel(token, projectId, label), isA<ApiResponse>());
  });

  test('Delete label', () async {
    when(mockAPI.deleteLabel(token, projectId, labelId))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.deleteLabel(token, projectId, labelId),
        isA<ApiResponse>());
  });
}
