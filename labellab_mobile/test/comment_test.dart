import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/model/comment.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'mock_labellab_api.dart';
final String issueId = 'issue_id';
final String commentId = 'comment_id';
final String token = 'token';
final String text = 'mock Comment';

final Comment comment = Comment();
final Map<String, dynamic> jsonData = {'test': true};

@GenerateMocks([LabelLabAPI])
void main() {
  final mockAPI = MockLabelLabAPI();

  setUp(() {});

  tearDown(() {});

  test('Get Comments', () async {
    when(mockAPI.getComments(token,issueId))
        .thenAnswer((realInvocation) async => List<Comment>.empty());

    expect(
      await mockAPI.getComments(token,issueId),
      isA<List<Comment>>(),
    );
  });

  test('post Comment', () async {
    when(mockAPI.postComment(token, comment,text))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.postComment(token, comment,text), isA<ApiResponse>());
  });

  test('Update comment', () async {
    when(mockAPI.updateComment(token,commentId, comment))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.updateComment(token,commentId, comment), isA<ApiResponse>());
  });

  test('Delete comment', () async {
    when(mockAPI.deleteComment(token,commentId, comment))
        .thenAnswer((realInvocation) async => ApiResponse(jsonData));

    expect(await mockAPI.deleteComment(token,commentId, comment), isA<ApiResponse>());
  });
}