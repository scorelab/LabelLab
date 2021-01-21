class LoginResponse {
  bool success;
  String accessToken;
  String refreshToken;
  String msg;

  LoginResponse(dynamic json) {
    this.success = json['success'];
    this.accessToken = json['token'];
    this.refreshToken = json['token'];
    this.msg = json['msg'];
  }
}
