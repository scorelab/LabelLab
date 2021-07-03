import 'dart:io';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';

import 'mock_labellab_api.dart';

// Parameters
final String token = 'token';
final String id = 'id';
final File image = File('image');
final Map<String, dynamic> jsonData = {'test': true};

// This file covers tests for all classification endpoints
@GenerateMocks([LabelLabAPI])
void main() {
  final mockAPI = MockLabelLabAPI();

  setUp(() {});

  tearDown(() {});

  test('Classify image', () async {
    when(mockAPI.classify(token, image))
        .thenAnswer((realInvocation) async => Classification());

    expect(
      await mockAPI.classify(token, image),
      isA<Classification>(),
    );
  });

  test('Get classifications', () async {
    when(mockAPI.getClassifications(token))
        .thenAnswer((realInvocation) async => List<Classification>.empty());

    expect(
        await mockAPI.getClassifications(token), isA<List<Classification>>());
  });

  test('Get classification', () async {
    when(mockAPI.getClassification(token, id))
        .thenAnswer((realInvocation) async => Classification());

    expect(await mockAPI.getClassification(token, id), isA<Classification>());
  });

  test('Delete classification', () async {
    when(mockAPI.deleteClassification(token, id))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.deleteClassification(token, id), isA<ApiResponse>());
  });
}
