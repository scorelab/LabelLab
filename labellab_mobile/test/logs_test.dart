import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/model/log.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';

import 'mock_labellab_api.dart';

// Parameters
final String token = 'labelab_token';
final String projectId = 'project_id';
final String category = 'category';
final String memberEmail = 'member_email';
final String entityType = 'entity_type';
final String entityId = 'entity_id';

// This file covers tests for all activity log endpoints
@GenerateMocks([LabelLabAPI])
void main() {
  final mockAPI = MockLabelLabAPI();

  setUp(() {});

  tearDown(() {});

  test('Get all logs of a project', () async {
    when(mockAPI.getProjectActivityLogs(token, projectId))
        .thenAnswer((realInvocation) async => List<Log>.empty());

    expect(
      await mockAPI.getProjectActivityLogs(token, projectId),
      isA<List<Log>>(),
    );
  });

  test('Get all category specific logs', () async {
    when(mockAPI.getCategorySpecificLogs(token, projectId, category))
        .thenAnswer((realInvocation) async => List<Log>.empty());

    expect(
      await mockAPI.getCategorySpecificLogs(token, projectId, category),
      isA<List<Log>>(),
    );
  });

  test('Get all member specific logs', () async {
    when(mockAPI.getMemberSpecificLogs(token, projectId, memberEmail))
        .thenAnswer((realInvocation) async => List<Log>.empty());

    expect(
      await mockAPI.getMemberSpecificLogs(token, projectId, memberEmail),
      isA<List<Log>>(),
    );
  });

  test('Get all entity specific logs', () async {
    when(mockAPI.getEntitySpecificLogs(token, projectId, entityType, entityId))
        .thenAnswer((realInvocation) async => List<Log>.empty());

    expect(
      await mockAPI.getEntitySpecificLogs(
          token, projectId, entityType, entityId),
      isA<List<Log>>(),
    );
  });
}
