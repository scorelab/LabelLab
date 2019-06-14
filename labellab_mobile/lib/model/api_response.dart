class ApiResponse {
  bool success;
  String msg;

  ApiResponse(dynamic json) {
    this.success = json['success'];
    this.msg = json['msg'];
  }
}