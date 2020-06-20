import 'package:flutter/material.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:provider/provider.dart';

// Helper to wrap with material app
Widget wrapWidget({Widget child}) {
  return ChangeNotifierProvider<AuthState>(
    builder: (context) => AuthState(),
    child: MaterialApp(
      home: child,
    ),
  );
}
