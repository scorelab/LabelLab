import 'package:labellab_mobile/model/team.dart';
import 'package:labellab_mobile/model/user.dart';

import 'mapper/issue_mapper.dart';

enum IssueStatus { REVIEW, IN_PROGRESS, CLOSED, DONE, OPEN }

enum IssuePriority { LOW, HIGH, MEDIUM, CRITICAL }

enum IssueCategory { GENERAL, LABEL, IMAGE, IMAGE_LABELLING, MODELS, MISC }

// "general","labels","images","image labelling","models","misc"
class Issue {
  String? id;
  String? issueTitle;
  String? description;
  // User? createdbyUser;
  // User? assignedUser;
  // Team? assignedTeam;
  IssueStatus? issueStatus;
  IssuePriority? issuePriority;
  IssueCategory? issueCategory;
  DateTime? createdAt;
  DateTime? dueDateAt;
  DateTime? updatedAt;

  Issue({this.id});

  Issue.fromJson(dynamic json, {bool isDense = false}) {
    id = json['id'].toString();
    issueTitle = json['title'];
    description = json['description'];
    // createdbyUser = json['team_id'].toString();
    // teamName = json['team_name'];
    issueStatus = IssueMapper.mapJsonToStatus(json["status"]);
    issuePriority = IssueMapper.mapJsonToPriority(json["priority"]);
    issueCategory = IssueMapper.mapJsonToCategory(json["category"]);
    createdAt = DateTime.parse(json["created_by"]);
    dueDateAt = DateTime.parse(json["created_by"]);
    updatedAt = DateTime.parse(json["updated_by"]);
  }
}
