import 'package:labellab_mobile/data/local/project_provider.dart';
import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/labellab_api.dart';
import 'package:labellab_mobile/data/remote/labellab_api_impl.dart';
import 'package:labellab_mobile/model/api_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Repository {
  LabelLabAPI _api;
  ProjectProvider _projectProvider;

  String accessToken;

  Future<bool> initToken() {
    return SharedPreferences.getInstance().then((pref) {
      String token = pref.getString("token");
      if (token != null) {
        accessToken = token;
        return true;
      } else {
        return false;
      }
    });
  }

  Future<LoginResponse> login(AuthUser user) {
    return _api.login(user).then((response) {
      this.accessToken = response.token;
      SharedPreferences.getInstance().then((pref) {
        pref.setString("token", response.token);
      });
      return response;
    });
  }

  Future<void> logout() {
    this.accessToken = null;
    return SharedPreferences.getInstance().then((pref) {
      pref.setString("token", null);
    });
  }

  Future<LoginResponse> register(RegisterUser user) {
    return _api.register(user).then((response) {
      if (response.err_field == null) {
        return login(user);
      } else
        throw Exception(response.msg);
    });
  }

  Future<User> usersInfo() {
    if (accessToken == null) return Future(null);
    return _api.usersInfo(accessToken);
  Future<ApiResponse> createProject(Project project) {
    if (accessToken == null) return Future(null);
    return _api.createProject(accessToken, project);
  }

  Future<Project> getProject(String id) {
    if (accessToken == null) return Future(null);
    return _api.getProject(accessToken, id);
  }

  Future<List<Project>> getProjectsLocal() {
    return _projectProvider.open().then((_) {
      return _projectProvider.getProjects().then((projects) {
        _projectProvider.close();
        return projects;
      });
    });
  }

  Future<List<Project>> getProjects() {
    if (accessToken == null) return Future(null);
    return _api.getProjects(accessToken).then((projects) {
      _projectProvider.open().then((_) async {
        for (var project in projects) {
          await _projectProvider
              .getProject(project.id)
              .then((cachedProject) async {
            if (cachedProject == null) {
              await _projectProvider.insert(project);
            }
          });
        }
        _projectProvider.close();
      });
      return projects;
    });
  }

  Future<ApiResponse> updateProject(Project project) {
    if (accessToken == null) return Future(null);
    return _api.updateProject(accessToken, project);
  }

  // Singleton
  static final Repository _respository = Repository._internal();

  factory Repository() {
    return _respository;
  }

  Repository._internal()
      : _api = LabelLabAPIImpl(),
        _projectProvider = ProjectProvider();
}
