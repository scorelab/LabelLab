import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:labellab_mobile/data/remote/dto/google_user_request.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/user.dart';

class AuthState with ChangeNotifier {
  final Repository _respository = Repository();

  // State
  User user;

  bool get isAuthenticated => user != null && user.id != null;
  bool get isLoading => user != null && user.id == null;

  AuthState() {
    user = User(username: "", name: "", email: "");
    notifyListeners();
    _respository.initToken().then((isSuccess) {
      if (isSuccess) {
        _respository.usersInfoLocal().then((user) async {
          this.user = user;
          notifyListeners();
          await _respository.usersInfo().then((User user) {
            this.user = user;
            notifyListeners();
          }).catchError((err) {});
        });
      } else {
        this.user = null;
        notifyListeners();
      }
    }).catchError((err) {
      this.user = null;
      notifyListeners();
    });
  }

  Future<bool> signin(AuthUser user) {
    return _respository.login(user).then((response) => _loadUserData(response));
  }

  Future<bool> signInWithGoogle() {
    GoogleSignIn _googleSignIn = GoogleSignIn(
      signInOption: SignInOption.standard,
      scopes: [
        'profile',
        'email',
        'openid',
      ],
    );
    return _googleSignIn.signIn().then((res) async {
      print(res.toString());
      var auth = await res.authentication;
      return await _respository
          .loginWithGoogle(GoogleUserRequest(res, auth.accessToken))
          .then((response) => _loadUserData(response));
    });
  }

  Future<bool> register(RegisterUser user) {
    return _respository
        .register(user)
        .then((response) => _loadUserData(response));
  }

  Future<bool> _loadUserData(LoginResponse response) {
    print("Success: " + response.token);
    return _respository.usersInfo().then((User user) {
      this.user = user;
      notifyListeners();
      return response.success;
    });
  }

  Future<void> signout() {
    return _respository.logout().then((_) {
      user = null;
      notifyListeners();
    });
  }
}
