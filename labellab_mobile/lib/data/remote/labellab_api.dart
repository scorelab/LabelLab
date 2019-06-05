import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';

abstract class LabelLabAPI {
  Future<LoginResponse> login(AuthUser user);
}