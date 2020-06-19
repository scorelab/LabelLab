class LoginResponse {
  bool success;
  String token;
  String msg;

  LoginResponse(dynamic json) {
    this.success = json['success'];
    this.token = json['token'];
    this.msg = json['msg'];
  }

  LoginResponse.mock() {
    this.success = true;
    this.token = "mock-token";
    this.msg = "success";
  }
}
