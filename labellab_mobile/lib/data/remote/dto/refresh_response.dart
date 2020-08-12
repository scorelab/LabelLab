class RefreshResponse {
  String accessToken;
  String message;

  RefreshResponse(dynamic json) {
    this.accessToken = json['access_token'];
    this.message = json['msg'];
  }
}
