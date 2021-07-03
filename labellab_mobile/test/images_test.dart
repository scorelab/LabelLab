import 'package:labellab_mobile/model/location.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/upload_image.dart';
import 'package:labellab_mobile/model/label_selection.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';

import 'mock_labellab_api.dart';

// Parameters
final String token = 'token';
final String projectId = 'project_id';
final UploadImage uploadImage = UploadImage();
final Image image = Image();
final String imageId = 'image_id';
final Map<String, dynamic> jsonData = {'test': true};
final List<LabelSelection> selections = [];
final List<String> imageIds = [];

// This file covers tests for all images endpoints
@GenerateMocks([LabelLabAPI])
void main() {
  final mockAPI = MockLabelLabAPI();

  setUp(() {});

  tearDown(() {});

  test('Upload image', () async {
    when(mockAPI.uploadImage(token, projectId, uploadImage))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(
      await mockAPI.uploadImage(token, projectId, uploadImage),
      isA<ApiResponse>(),
    );
  });

  test('Get images', () async {
    when(mockAPI.getImages(token, projectId))
        .thenAnswer((realInvocation) async => List<Image>.empty());

    expect(await mockAPI.getImages(token, projectId), isA<List<Image>>());
  });

  test('Get image', () async {
    when(mockAPI.getImage(token, imageId))
        .thenAnswer((realInvocation) async => image);

    expect(await mockAPI.getImage(token, imageId), isA<Image>());
  });

  test('Update image', () async {
    when(mockAPI.updateImage(token, projectId, image, selections))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.updateImage(token, projectId, image, selections),
        isA<ApiResponse>());
  });

  test('Delete image', () async {
    when(mockAPI.deleteImage(token, projectId, imageId))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.deleteImage(token, projectId, imageId),
        isA<ApiResponse>());
  });

  test('Delete images', () async {
    when(mockAPI.deleteImages(token, projectId, imageIds))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.deleteImages(token, projectId, imageIds),
        isA<ApiResponse>());
  });

  test('Get image path', () async {
    when(mockAPI.getImagesPath(token, projectId, imageIds))
        .thenAnswer((realInvocation) async => List<Location>.empty());

    expect(await mockAPI.getImagesPath(token, projectId, imageIds),
        isA<List<Location>>());
  });
}
