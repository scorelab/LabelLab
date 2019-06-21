import 'package:labellab_mobile/data/local/entities/classification_entity.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:sqflite/sqflite.dart';

class ClassificationProvider {
  static const String _path = "labellab/classification";

  Database db;

  Future open() async {
    db = await openDatabase(_path, version: 1,
        onCreate: (Database db, int version) async {
      await db.execute('''
        create table ${ClassificationEntity.table} ( 
        ${ClassificationEntity.columnId} text primary key,
        ${ClassificationEntity.columnImageURL} text not null)
        ''');
    });
  }

  Future<void> replaceClassifications(List<Classification> classifications) {
    return db.delete(ClassificationEntity.table).then((_) async {
      for (var classification in classifications) {
        await db.insert(ClassificationEntity.table,
            ClassificationEntity.from(classification).toMap());
      }
    });
  }

  Future<void> insert(Classification classification) async {
    await db.insert(ClassificationEntity.table,
        ClassificationEntity.from(classification).toMap());
  }

  Future<Classification> getClassification(String id) async {
    List<Map> maps = await db.query(ClassificationEntity.table,
        columns: [
          ClassificationEntity.columnId,
          ClassificationEntity.columnImageURL
        ],
        where: '${ClassificationEntity.columnId} = ?',
        whereArgs: [id]);
    if (maps.length > 0) {
      return ClassificationEntity.fromMap(maps.first);
    }
    return null;
  }

  Future<List<Classification>> getClassifications() async {
    List<Map> maps = await db.query(ClassificationEntity.table, columns: [
      ClassificationEntity.columnId,
      ClassificationEntity.columnImageURL
    ]);
    if (maps.length > 0) {
      return maps.map((item) => ClassificationEntity.fromMap(item)).toList();
    }
    return null;
  }

  Future<void> delete(String id) async {
    await db.delete(ClassificationEntity.table,
        where: '${ClassificationEntity.columnId} = ?', whereArgs: [id]);
  }

  Future<int> update(Classification classification) async {
    return await db.update(ClassificationEntity.table,
        ClassificationEntity.from(classification).toMap(),
        where: '${ClassificationEntity.columnId} = ?',
        whereArgs: [classification.id]);
  }

  Future close() async => db.close();
}
