import 'package:labellab_mobile/model/auth_user.dart';

class RegisterUser extends AuthUser {
  String name;
  String username;
  String password2;

  RegisterUser(this.name, this.username, email, password, this.password2)
      : super(email, password);

  RegisterUser.just() : super.just();

  Map<String, dynamic> toMap() {
    return {
      "name": name,
      "username": username,
      "email": email,
      "password": password,
      "password2": password2,
    };
  }
}
