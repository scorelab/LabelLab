import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/labellab_api_impl.dart';
import 'package:labellab_mobile/model/auth_user.dart';

class Respository {
  LabelLabAPI _api;

  Future<LoginResponse> login(AuthUser user) {
    return _api.login(user);
  }

  // Singleton
  static final Respository _respository = Respository._internal();

  factory Respository() {
    return _respository;
  }

  Respository._internal() : _api = LabelLabAPIImpl();
}
