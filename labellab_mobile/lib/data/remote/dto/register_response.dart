import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/user.dart';

class RegisterResponse {
  String msg;
  String err_field;

  RegisterResponse(dynamic json) {
    this.msg = json['msg'];
    this.err_field = json['err_field'];
  }
}