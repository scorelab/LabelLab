import 'package:labellab_mobile/data/local/entities/project_entity.dart';
import 'package:labellab_mobile/model/project.dart';
import 'package:sqflite/sqflite.dart';

class ProjectProvider {
  static const String _path = "labellab/project";

  late Database db;

  Future open() async {
    db = await openDatabase(_path, version: 1,
        onCreate: (Database db, int version) async {
      await db.execute('''
        create table ${ProjectEntity.table} ( 
        ${ProjectEntity.columnId} text primary key, 
        ${ProjectEntity.columnDescription} text,
        ${ProjectEntity.columnName} text not null)
        ''');
    });
  }

  Future<void> replaceProjects(List<Project> projects) {
    return db.delete(ProjectEntity.table).then((_) async {
      for (var project in projects) {
        await db.insert(
            ProjectEntity.table, ProjectEntity.from(project).toMap());
      }
    });
  }

  Future<void> insert(Project project) async {
    await db.insert(ProjectEntity.table, ProjectEntity.from(project).toMap());
  }

  Future<Project?> getProject(String id) async {
    List<Map> maps = await db.query(ProjectEntity.table,
        columns: [ProjectEntity.columnId, ProjectEntity.columnName],
        where: '${ProjectEntity.columnId} = ?',
        whereArgs: [id]);
    if (maps.length > 0) {
      return ProjectEntity.fromMap(maps.first as Map<String, dynamic>);
    }
    return null;
  }

  Future<List<Project>?> getProjects() async {
    List<Map> maps = await db.query(ProjectEntity.table,
        columns: [ProjectEntity.columnId, ProjectEntity.columnName]);
    if (maps.length > 0) {
      return maps.map((item) => ProjectEntity.fromMap(item as Map<String, dynamic>)).toList();
    }
    return null;
  }

  Future<void> delete(String id) async {
    await db.delete(ProjectEntity.table,
        where: '${ProjectEntity.columnId} = ?', whereArgs: [id]);
  }

  Future<int> update(Project project) async {
    return await db.update(
        ProjectEntity.table, ProjectEntity.from(project).toMap(),
        where: '${ProjectEntity.columnId} = ?', whereArgs: [project.id]);
  }

  Future close() async => db.close();
}
