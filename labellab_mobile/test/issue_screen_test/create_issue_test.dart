import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/data/remote/dto/api_response.dart';
import 'package:labellab_mobile/model/issue.dart';
import 'package:labellab_mobile/model/mapper/issue_mapper.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/screen/issue/add_edit/add_edit_issue_screen.dart';
import 'package:labellab_mobile/screen/sign_up/sign_up_screen.dart';
import 'package:mockito/mockito.dart';

import 'package:flutter/material.dart';

import '../mock_labellab_api_impl.dart';
import '../wrapper/material_wrapper.dart';

// Parameters
final String id = "1";
final String projectId = "1";
final String issueTitle = "";
final String issuedesc = "";
final String issuecaegory = "General";
final String token = 'token';
final Issue issue = Issue();

void main() {
  MockAPI mockAPI = MockAPI();
  AddEditIssueScreen addEditIssueScreen = AddEditIssueScreen(
    id: id,
    project_id: projectId,
  );
  testWidgets('create issue validaton', (WidgetTester tester) async {
    await tester.pumpWidget(wrapWidget(child: addEditIssueScreen));

    //selecting the text form field and entering the text "issueTitle"
    await tester.enterText(find.byKey(Key("issue_title")), issueTitle);

     //selecting the text form field and entering the text "issuedesc"
    await tester.enterText(find.byKey(Key("issue_description")), issuedesc);

    //selecting the dropdown with the key
    final dropdown = find.byKey(const Key('issue_category'));
    await tester.tap(dropdown);
    await tester.pumpAndSettle();

    //selecting the dropdown category
    final dropdownItem = find.text(issuecaegory).last;

    await tester.tap(dropdownItem);
    await tester.pumpAndSettle();

    //verify the create Issue function is called once
    verify(mockAPI.createIssue(token,issue)).called(1);
   
  });
    
  
}
