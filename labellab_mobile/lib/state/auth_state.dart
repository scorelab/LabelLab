import 'package:flutter/foundation.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/user.dart';

class AuthState with ChangeNotifier {
  final Respository _respository = Respository();

  // State
  User user;

  AuthState() {
    // TODO - Load cached user, check the validity and assign to current user
    // user = User(
    //   name: "Udesh Kumarasinghe",
    //   username: "udeshuk",
    //   email: "mail@udesh.xyz",
    // );
    notifyListeners();
  }

  Future<bool> signin(AuthUser user) {
    return _respository.login(user).then((response) {
      print("Success: " + response.token);
      this.user = User(
        username: "udeshuk",
        email: "mail@udesh.xyz",
        name: "Udesh Kumarasinghe",
      );
      notifyListeners();
      return response.success;
    });
  }

  void signout() {
    // TODO - Implement sign out login
  }
}
