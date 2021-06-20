import 'package:labellab_mobile/model/image.dart';
import 'package:labellab_mobile/model/label.dart';
import 'package:labellab_mobile/model/log.dart';
import 'package:labellab_mobile/model/member.dart';
import 'package:labellab_mobile/model/team.dart';
import 'package:labellab_mobile/model/ml_model.dart';

class Project {
  String? id;
  String? adminId;
  String? name;
  String? description;
  List<Member>? members;
  List<Image>? images;
  List<Label>? labels;
  List<Team>? teams;
  List<MlModel>? models;
  List<Log>? logs;

  Project({
    this.id,
    this.adminId,
    this.name,
    this.description,
    this.members,
    this.images,
    this.labels,
    this.teams,
    this.logs,
  });

  Project.fromJson(dynamic json,
      {bool isDense = false, String? imageEndpoint}) {
    id = json["id"].toString();
    adminId = json["admin_id"].toString();
    name = json["project_name"];
    description = json["project_description"];
    if (json["members"] != null && !isDense) {
      members = (json["members"] as List)
          .map(
            (member) => Member.fromJson(member),
          )
          .toSet()
          .toList();
    }
    if (json["images"] != null && !isDense) {
      images = (json["images"] as List)
          .map(
            (image) => Image.fromJson(image, imageEndpoint: imageEndpoint),
          )
          .toList();
    }
    if (json["labels"] != null && !isDense) {
      labels = (json["labels"] as List)
          .map(
            (label) => Label.fromJson(label),
          )
          .toList();
    }
    if (json["teams"] != null && !isDense) {
      print(json["teams"]);
      teams = (json["teams"] as List)
          .map((team) => Team.fromJson(team, isDense: true))
          .toList();
    }
    if (json["logs"] != null && !isDense) {
      logs = (json["logs"] as List).map((log) => Log.fromJSON(log)).toList();
    }
  }

  Map<String, dynamic> toMap() {
    return {
      "project_name": name,
      "project_description": description,
    };
  }
}
