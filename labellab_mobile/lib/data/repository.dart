import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/labellab_api_impl.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Respository {
  LabelLabAPI _api;

  String accessToken;

  Future<bool> initToken() {
    return SharedPreferences.getInstance().then((pref) {
      String token = pref.getString("token");
      if (token != null) {
        accessToken = token;
        return true;
      } else {
        return false;
      }
    });
  }

  Future<LoginResponse> login(AuthUser user) {
    return _api.login(user).then((response) {
      this.accessToken = response.token;
      SharedPreferences.getInstance().then((pref) {
        pref.setString("token", response.token);
      });
      return response;
    });
  }

  Future<void> logout() {
    this.accessToken = null;
    return SharedPreferences.getInstance().then((pref) {
      pref.setString("token", null);
    });
  }

  Future<LoginResponse> register(RegisterUser user) {
    return _api.register(user).then((response) {
      if (response.err_field == null) {
        return login(user);
      } else
        throw Exception(response.msg);
    });
  }

  Future<User> usersInfo() {
    if (accessToken == null) return Future(null);
    return _api.usersInfo(accessToken);
  }

  // Singleton
  static final Respository _respository = Respository._internal();

  factory Respository() {
    return _respository;
  }

  Respository._internal() : _api = LabelLabAPIImpl();
}
