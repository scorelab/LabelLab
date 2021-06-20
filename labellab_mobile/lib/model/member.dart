class Member {
  String? id, name, email, role, teamId, teamName, projectId;

  Member(
      {this.id,
      this.name,
      this.email,
      this.role,
      this.teamId,
      this.teamName,
      this.projectId});

  Member.fromJson(dynamic json) {
    id = json['id'];
    name = json['name'];
    email = json['email'];
    teamId = json['team_id'].toString();
    teamName = json['team_name'];
    role = json['team_role'];
    projectId = json['project_id'].toString();
  }

  bool operator ==(Object other) =>
      identical(this, other) || (other as Member).email == email;

  int get hashCode => id.hashCode;
}
