class Member {
  String? name, email, role, teamId, teamName, projectId;

  Member(
      {this.name,
      this.email,
      this.role,
      this.teamId,
      this.teamName,
      this.projectId});

  Member.fromJson(dynamic json) {
    name = json['name'];
    email = json['email'];
    teamId = json['team_id'].toString();
    teamName = json['team_name'];
    role = json['team_role'];
    projectId = json['project_id'].toString();
  }
}
