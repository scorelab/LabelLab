import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/model/team.dart';
import 'package:labellab_mobile/model/message.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';

import 'mock_labellab_api.dart';

// Parameters
final String token = 'token';
final String projectId = 'project_id';
final String teamId = 'team_id';
final String memberEmail = 'member_email';
final Map<String, dynamic> jsonData = {'test': true};

// This file covers tests for all team endpoints
@GenerateMocks([LabelLabAPI])
void main() {
  final mockAPI = MockLabelLabAPI();

  setUp(() {});

  tearDown(() {});

  test('Create Team', () async {
    when(mockAPI.createTeam(token, projectId, jsonData))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
      await mockAPI.createTeam(token, projectId, jsonData),
      isA<ApiResponse>(),
    );
  });

  test('View team details', () async {
    when(mockAPI.getTeamDetails(token, projectId, teamId))
        .thenAnswer((realInvocation) async => Team());

    expect(
      await mockAPI.getTeamDetails(token, projectId, teamId),
      isA<Team>(),
    );
  });

  test('Add team member', () async {
    when(mockAPI.addTeamMember(token, projectId, teamId, memberEmail))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.addTeamMember(token, projectId, teamId, memberEmail),
        isA<ApiResponse>());
  });

  test('Remove team member', () async {
    when(mockAPI.removeTeamMember(token, projectId, teamId, memberEmail))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
        await mockAPI.removeTeamMember(token, projectId, teamId, memberEmail),
        isA<ApiResponse>());
  });

  test('Get chatroom messages', () async {
    when(mockAPI.getChatroomMessages(token, teamId))
        .thenAnswer((realInvocation) async => List<Message>.empty());

    expect(
        await mockAPI.getChatroomMessages(token, teamId), isA<List<Message>>());
  });
}
