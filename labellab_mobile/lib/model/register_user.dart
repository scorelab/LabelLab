import 'package:labellab_mobile/model/user.dart';

class RegisterUser extends User {
  String password2;

  RegisterUser(name, username, email, password, this.password2)
      : super(username: username, name: name, email: email, password: password);

  RegisterUser.just() : super();

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
