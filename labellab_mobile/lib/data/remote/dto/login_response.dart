class LoginResponse {
  bool? success;
  String? accessToken;
  String? refreshToken;
  String? msg;

  LoginResponse(dynamic json) {
    this.success = json['success'];
    this.accessToken = json['access_token'];
    this.refreshToken = json['refresh_token'];
    this.msg = json['msg'];
  }
}
