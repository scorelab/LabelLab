import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/model/issue.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'mock_labellab_api.dart';
final String token = 'token';
final String projectId = 'project_id';
final String issueId = 'issue_id';
final String assigneeId = 'assignee_id';
final String category = 'category';
final Issue issue = Issue();
final Map<String, dynamic> jsonData = {'test': true};

@GenerateMocks([LabelLabAPI])
void main() {
  final mockAPI = MockLabelLabAPI();

  setUp(() {});

  tearDown(() {});

  test('Get issues', () async {
    when(mockAPI.getIssues(token,projectId))
        .thenAnswer((realInvocation) async => List<Issue>.empty());

    expect(
      await mockAPI.getIssues(token,projectId),
      isA<List<Issue>>(),
    );
  });

    test('Get issue', () async {
    when(mockAPI.getIssue(token, projectId,issueId))
        .thenAnswer((realInvocation) async => Issue());

    expect(await mockAPI.getIssue(token, projectId,issueId), isA<Issue>());
  });

  test('Create issue', () async {
    when(mockAPI.createIssue(token, issue))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.createIssue(token, issue), isA<ApiResponse>());
  });

  test('Update issue', () async {
    when(mockAPI.updateIssue(token, issue))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.updateIssue(token, issue), isA<ApiResponse>());
  });

  test('Delete issue', () async {
    when(mockAPI.deleteIssue(token,issueId, projectId))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.deleteIssue(token,issueId, projectId), isA<ApiResponse>());
  });

  test('Assigen issue', () async {
    when(mockAPI.assignIssue(token, projectId, issueId,assigneeId))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.assignIssue(token, projectId, issueId,assigneeId),
        isA<ApiResponse>());
  });

    test('Get all category specific issue', () async {
    when(mockAPI.getCategorySpecificIssue(token, projectId, category))
        .thenAnswer((realInvocation) async => List<Issue>.empty());

    expect(
      await mockAPI.getCategorySpecificIssue(token, projectId, category),
      isA<List<Issue>>(),
    );
  });
}