import 'package:labellab_mobile/model/user.dart';

class RegisterResponse {
  User user;
  String msg;
  String err_field;

  RegisterResponse(dynamic json) {
    this.user = User.fromJson(json);
    this.msg = json['msg'];
    this.err_field = json['err_field'];
  }
}