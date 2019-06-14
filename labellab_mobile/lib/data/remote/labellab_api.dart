import 'package:labellab_mobile/data/remote/dto/login_response.dart';
import 'package:labellab_mobile/data/remote/dto/register_response.dart';
import 'package:labellab_mobile/model/api_response.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/user.dart';

abstract class LabelLabAPI {
  Future<LoginResponse> login(AuthUser user);
  Future<RegisterResponse> register(RegisterUser user);
  Future<User> usersInfo(String token);

  // Project
  Future<List<Project>> getProjects(String token);
  Future<Project> getProject(String token, String id);
  Future<ApiResponse> createProject(String token, Project project);
  Future<ApiResponse> updateProject(String token, Project project);
}