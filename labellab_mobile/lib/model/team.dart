class Team {
  String id;
  String projectId;
  String name;
  String role;
  List members;

  Team({
    this.id,
    this.projectId,
    this.name,
    this.members,
  });

  Team.fromJson(dynamic json) {
    id = json["id"].toString();
    projectId = json["project_id"].toString();
    name = json["team_name"];
    role = json["role"];
    members = json["team_members"]
        .map((member) => member["user_id"].toString())
        .toList();
  }

  Map<String, dynamic> toMap() {
    return {
      "id": id,
      "project_id": projectId,
      "team_name": name,
      "role": role,
      "members": members,
    };
  }
}
