import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';

import 'mock_labellab_api.dart';

// Parameters
final String token = 'token';
final String projectId = 'project_id';
final String email = 'email';
final String teamname = 'team_name';
final String role = 'role';
final Project project = Project();
final Map<String, dynamic> jsonData = {'test': true};

// This file covers tests for all project endpoints
@GenerateMocks([LabelLabAPI])
void main() {
  final mockAPI = MockLabelLabAPI();

  setUp(() {});

  tearDown(() {});

  test('Get projects', () async {
    when(mockAPI.getProjects(token))
        .thenAnswer((realInvocation) async => List<Project>.empty());

    expect(
      await mockAPI.getProjects(token),
      isA<List<Project>>(),
    );
  });

  test('Get project', () async {
    when(mockAPI.getProject(token, projectId))
        .thenAnswer((realInvocation) async => Project());

    expect(await mockAPI.getProject(token, projectId), isA<Project>());
  });

  test('Create project', () async {
    when(mockAPI.createProject(token, project))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.createProject(token, project), isA<ApiResponse>());
  });

  test('Update project', () async {
    when(mockAPI.updateProject(token, project))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.updateProject(token, project), isA<ApiResponse>());
  });

  test('Delete project', () async {
    when(mockAPI.deleteProject(token, projectId))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.deleteProject(token, projectId), isA<ApiResponse>());
  });

  test('Add member', () async {
    when(mockAPI.addMember(token, projectId, email, teamname, role))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.addMember(token, projectId, email, teamname, role),
        isA<ApiResponse>());
  });

  test('Remove member', () async {
    when(mockAPI.removeMember(token, projectId, email))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.removeMember(token, projectId, email),
        isA<ApiResponse>());
  });

  test('Get member roles', () async {
    when(mockAPI.getMemberRoles(token, projectId))
        .thenAnswer((realInvocation) async => List<String>.empty());

    expect(await mockAPI.getMemberRoles(token, projectId), isA<List<String>>());
  });

  test('Leave a project', () async {
    when(mockAPI.leaveProject(token, projectId))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.leaveProject(token, projectId), isA<ApiResponse>());
  });

  test('Make admin', () async {
    when(mockAPI.makeAdmin(token, projectId, email))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
        await mockAPI.makeAdmin(token, projectId, email), isA<ApiResponse>());
  });

  test('Remove admin', () async {
    when(mockAPI.removeAdmin(token, projectId, email))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
        await mockAPI.removeAdmin(token, projectId, email), isA<ApiResponse>());
  });
}
