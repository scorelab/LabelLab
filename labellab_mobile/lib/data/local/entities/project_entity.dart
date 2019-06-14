import 'package:labellab_mobile/model/project.dart';

class ProjectEntity extends Project {
  static const String table = 'project';
  static const String columnId = '_id';
  static const String columnName = 'name';

  ProjectEntity.from(Project project) {
    this.id = project.id;
    this.name = project.name;
  }

  ProjectEntity.fromMap(Map<String, dynamic> map) {
    id = map[columnId];
    name = map[columnName];
  }
  
   Map<String, dynamic> toMap() {
    var map = <String, dynamic>{
      columnName: name
    };
    if (id != null) {
      map[columnId] = id;
    }
    return map;
  }
}
