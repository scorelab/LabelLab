import 'package:labellab_mobile/model/issue.dart';
import 'package:sqflite/sqflite.dart';

import 'entities/issue_entity.dart';

class IssueProvider {
  static const String _path = "labellab/issue";

  late Database db;

  Future open() async {
    db = await openDatabase(_path, version: 1,
        onCreate: (Database db, int version) async {
      await db.execute('''
        create table ${IssueEntity.table} ( 
        ${IssueEntity.columnId} text primary key, 
        ${IssueEntity.columnDescription} text,
        ${IssueEntity.columnName} text not null)
        ''');
    });
  }


  Future<List<Issue>?> getIssues() async {
    List<Map> maps = await db.query(IssueEntity.table,
        columns: [IssueEntity.columnId, IssueEntity.columnName]);
    if (maps.length > 0) {
      return maps.map((item) => IssueEntity.fromMap(item as Map<String, dynamic>)).toList();
    }
    return null;
  }

   Future close() async => db.close();
}
