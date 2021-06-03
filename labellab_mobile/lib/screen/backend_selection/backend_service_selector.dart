import 'package:shared_preferences/shared_preferences.dart';

class BackendServiceSelector {
  static const URL_STORAGE_KEY = "labellab_backend_url";
  late SharedPreferences _sharedPreferences;

  Future<String?> getBackendURLFromLocalStorage() async {
    _sharedPreferences = await SharedPreferences.getInstance();
    try {
      String? backendUrl = _sharedPreferences.getString(URL_STORAGE_KEY);
      return backendUrl;
    } catch (e) {
      return null;
    }
  }
}
