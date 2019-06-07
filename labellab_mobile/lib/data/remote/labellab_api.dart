import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/dto/register_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/register_user.dart';

abstract class LabelLabAPI {
  Future<LoginResponse> login(AuthUser user);
  Future<RegisterResponse> register(RegisterUser user);
}