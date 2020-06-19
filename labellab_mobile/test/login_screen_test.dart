import 'package:flutter_test/flutter_test.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:mockito/mockito.dart';
import 'package:provider/provider.dart';
import 'mock_labellab_api_impl.dart';
import 'package:labellab_mobile/screen/login/login_screen.dart';
import 'package:flutter/material.dart';

// Parameters
final String email = "";
final String password = "";

void main() {
  MockAPI mockAPI = MockAPI();
  LoginScreen loginScreen = LoginScreen();

  testWidgets('No sign in on validation fail', (WidgetTester tester) async {
    await tester.pumpWidget(wrapWidget(child: loginScreen));
    await tester.tap(find.byKey(Key("signin-button")));

    verifyZeroInteractions(mockAPI);
  });

  testWidgets('Sign in with email & password', (WidgetTester tester) async {
    await tester.pumpWidget(wrapWidget(child: loginScreen));
    await tester.enterText(find.byKey(Key("email")), email);
    await tester.enterText(find.byKey(Key("password")), password);
    await tester.tap(find.byKey(Key("signin-button")));

    verify(mockAPI.login(AuthUser(email, password))).called(1);
    // expect(
    //     await mockAPI.login(AuthUser(email, password)), isA<LoginResponse>());
  });
}

// Helper to wrap with material app
Widget wrapWidget({Widget child}) {
  return ChangeNotifierProvider<AuthState>(
    builder: (context) => AuthState(),
    child: MaterialApp(
      home: child,
    ),
  );
}
