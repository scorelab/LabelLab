import 'package:labellab_mobile/model/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserProvider {
  Future<void> insert(User user) {
    return SharedPreferences.getInstance().then((pref) {
      pref.setString("id", user.id!);
      pref.setString("name", user.name!);
      pref.setString("username", user.username!);
      pref.setString("email", user.email!);
    });
  }

  Future<User?> getUser() {
    return SharedPreferences.getInstance().then((pref) {
      User user = User();
      user.id = pref.getString("id");
      user.name = pref.getString("name");
      user.username = pref.getString("username");
      user.email = pref.getString("email");
      if (user.id == null) return null;
      return user;
    });
  }

  Future<void> delete() {
    return SharedPreferences.getInstance().then((pref) {
      pref.remove("id");
      pref.remove("name");
      pref.remove("username");
      pref.remove("email");
    });
  }
}
