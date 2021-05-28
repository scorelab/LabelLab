class AuthUser {
  String? email;
  String? password;

  AuthUser(this.email, this.password);

  AuthUser.just();

  Map<String, dynamic> toMap() {
    return {
      "email": email,
      "password": password
    };
  }
}