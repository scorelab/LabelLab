import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/screen/sign_up/sign_up_screen.dart';
import 'package:mockito/mockito.dart';
import 'mock_labellab_api_impl.dart';
import 'package:flutter/material.dart';
import 'wrapper/material_wrapper.dart';

// Parameters
final String name = "";
final String username = "";
final String email = "";
final String password = "";

void main() {
  MockAPI mockAPI = MockAPI();
  SignUpScreen signUpScreen = SignUpScreen();

  testWidgets('No sign up on validation fail', (WidgetTester tester) async {
    await tester.pumpWidget(wrapWidget(child: signUpScreen));
    await tester.tap(find.byKey(Key("signup-button")));

    verifyZeroInteractions(mockAPI);
  });

  testWidgets('Sign up with valid data', (WidgetTester tester) async {
    await tester.pumpWidget(wrapWidget(child: signUpScreen));
    await tester.enterText(find.byKey(Key("username")), username);
    await tester.enterText(find.byKey(Key("name")), name);
    await tester.enterText(find.byKey(Key("email")), email);
    await tester.enterText(find.byKey(Key("password")), password);
    await tester.enterText(find.byKey(Key("confirm-password")), password);
    await tester.tap(find.byKey(Key("signup-button")));

    verify(mockAPI
            .register(RegisterUser(name, username, email, password, password)))
        .called(1);
  });
}
