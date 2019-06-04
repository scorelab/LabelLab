import 'package:labellab_mobile/model/auth_user.dart';

class User extends AuthUser{
  String name;
  String username;
  String email;
  String password;
  DateTime createdAt;

  User({this.name, this.username, this.email, this.password, this.createdAt}) : super(username, password);
}
