import 'package:labellab_mobile/model/log.dart';
import 'package:labellab_mobile/model/team_member.dart';

class Team {
  String? id;
  String? name;
  String? role;
  String? projectId;
  List<TeamMember>? members;
  List<Log>? logs;

  Team.fromJson(dynamic json, {bool isDense = false}) {
    id = json['id'].toString();
    name = json['team_name'];
    role = json['role'];
    projectId = json['project_id'].toString();
    if (json['members'] != null && !isDense) {
      members = (json['members'] as List)
          .map((member) => TeamMember.fromJson(member))
          .toList();
    }
    if (json['logs'] != null && !isDense) {
      logs =
          (json['logs'] as List).map((member) => Log.fromJSON(member)).toList();
    }
  }
}
