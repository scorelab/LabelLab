import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/labellab_api_impl.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/user.dart';

class Respository {
  LabelLabAPI _api;

  String accessToken;

  Future<LoginResponse> login(AuthUser user) {
    return _api.login(user).then((response) {
      this.accessToken = response.token;
      return response;
    });
  }

  void logout() {
    this.accessToken = null;
  }

  Future<LoginResponse> register(RegisterUser user) {
    return _api.register(user).then((response) {
      if (response.err_field == null) {
        return login(user);
      } else throw Exception(response.msg);
    });
  }

  Future<User> usersInfo() {
    if (accessToken == null) 
      return Future.error(Exception("No access token found"));
    return _api.usersInfo(accessToken);
  }

  // Singleton
  static final Respository _respository = Respository._internal();

  factory Respository() {
    return _respository;
  }

  Respository._internal() : _api = LabelLabAPIImpl();
}
