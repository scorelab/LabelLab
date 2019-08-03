
class RegisterResponse {
  String msg;
  String errField;

  RegisterResponse(dynamic json) {
    this.msg = json['msg'];
    this.errField = json['err_field'];
  }
}