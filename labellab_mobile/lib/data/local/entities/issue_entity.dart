import 'package:labellab_mobile/model/issue.dart';

class IssueEntity extends Issue {
  static const String table = 'issue';
  static const String columnId = '_id';
  static const String columnName = 'issue_title';
  static const String columnDescription = 'description';

  IssueEntity.from(Issue issue) {
    this.id = issue.id;
    this.issueTitle = issue.issueTitle;
    this.description = issue.description;
  }

  IssueEntity.fromMap(Map<String, dynamic> map) {
    id = map[columnId];
    issueTitle = map[columnName];
    description = map[columnDescription];
  }

  Map<String, dynamic> toMap() {
    var map = <String, dynamic>{columnName: issueTitle};
    if (id != null) {
      map[columnId] = id;
    }
    if (description != null) {
      map[columnDescription] = description;
    }
    return map;
  }
}
