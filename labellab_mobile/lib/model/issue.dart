import 'package:labellab_mobile/model/team.dart';
import 'package:labellab_mobile/model/user.dart';

import 'mapper/issue_mapper.dart';

enum IssueStatus { REVIEW, IN_PROGRESS, CLOSED, DONE, OPEN }

enum IssuePriority { LOW, HIGH, MEDIUM, CRITICAL }

enum IssueCategory { GENERAL, LABEL, IMAGE, IMAGE_LABELLING, MODELS, MISC }

class Issue {
  int? id;
  int? project_id;
  String? issueTitle;
  String? description;
  int? created_by;
  int? assignee_id;
  int? entityId;
  String? entityType;
  IssueStatus? issueStatus;
  int? team_id;
  IssuePriority? issuePriority;
  IssueCategory? issueCategory;
  String? created_At;
  String? dueDate;
  String? updated_At;

  Issue(
      {this.id,
      this.issueCategory,
      this.assignee_id,
      this.created_At,
      this.created_by,
      this.description,
      this.dueDate,
      this.entityId,
      this.entityType,
      this.issuePriority,
      this.issueStatus,
      this.issueTitle,
      this.project_id,
      this.team_id,
      this.updated_At});

  Issue.fromJson(dynamic json, {bool isDense = false}) {
    id = json['id'];
    issueTitle = json['title'];
    description = json['description'];
    // created_by = int.parse(json['created_by']);
    // team_id = int.parse(json['team_id']);
    issueStatus = IssueMapper.mapJsonToStatus(json["status"]);
    issuePriority = IssueMapper.mapJsonToPriority(json["priority"]);
    issueCategory = IssueMapper.mapJsonToCategory(json["category"]);
    // created_At = json["created_by"];
    // dueDate = json["due_date"];
    // updated_At = json["updated_at"];
    // assignee_id = int.parse(json["assignee_id"]);
    // entityId = int.parse(json['entity_id']);
    // entityType = json["entity_type"];
    // project_id = int.parse(json["project_id"]);
  }

  Map<String, dynamic> toMap() {
    return {
      "title": issueTitle,
      "description": description,
      // "category" : IssueMapper.categoryToString(issueCategory)
    };
  }
}
