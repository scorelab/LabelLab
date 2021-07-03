import 'dart:io';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';

import 'mock_labellab_api.dart';

// Parameters
final String token = 'labelab_token';
final String email = 'email';
final String username = 'username';
final File image = File('test');
final String currentPassword = 'current_password';
final String newPassword = 'new_password';
final Map<String, dynamic> jsonData = {'test': true};

// This file covers tests for all user endpoints
@GenerateMocks([LabelLabAPI])
void main() {
  final mockAPI = MockLabelLabAPI();

  setUp(() {});

  tearDown(() {});

  test('Get user info', () async {
    when(mockAPI.usersInfo(token)).thenAnswer((realInvocation) async => User());

    expect(
      await mockAPI.usersInfo(token),
      isA<User>(),
    );
  });

  test('Search user', () async {
    when(mockAPI.searchUser(token, email))
        .thenAnswer((realInvocation) async => List<User>.empty());

    expect(
      await mockAPI.searchUser(token, email),
      isA<List<User>>(),
    );
  });

  test('Edit user info', () async {
    when(mockAPI.editInfo(token, username))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
      await mockAPI.editInfo(token, username),
      isA<ApiResponse>(),
    );
  });

  test('Upload user image', () async {
    when(mockAPI.uploadUserImage(token, image))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
      await mockAPI.editInfo(token, username),
      isA<ApiResponse>(),
    );
  });

  test('Update password', () async {
    when(mockAPI.updatePassword(token, currentPassword, newPassword))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
      await mockAPI.updatePassword(token, currentPassword, newPassword),
      isA<ApiResponse>(),
    );
  });
}
