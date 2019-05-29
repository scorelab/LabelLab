import 'package:flutter/foundation.dart';
import 'package:labellab_mobile/model/user.dart';

class AuthState with ChangeNotifier{

  User user;

  AuthState() {
    // TODO - Load cached user, check the validity and assign to current user
    user = User(
      name: "Udesh Kumarasinghe",
      username: "udeshuk",
      email: "mail@udesh.xyz",
    );
    notifyListeners();
  }

  void signin(String username, String password) {
    // TODO - Authenticate user with the backend and cache it
  }

  void signout() {
    // TODO - Implement sign out login
  }

}
