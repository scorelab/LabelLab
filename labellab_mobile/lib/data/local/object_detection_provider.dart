import 'package:labellab_mobile/data/local/entities/object_detection_entity.dart';
import 'package:labellab_mobile/model/object_detection.dart';
import 'package:sqflite/sqflite.dart';

class ObjectDetectionProvider {
  static const String _path = "labellab/object_detection";

  Database db;

  Future open() async {
    db = await openDatabase(_path, version: 1,
        onCreate: (Database db, int version) async {
          await db.execute('''
        create table ${ObjectDetectionEntity.table} ( 
        ${ObjectDetectionEntity.columnId} text primary key,
        ${ObjectDetectionEntity.columnImageURL} text not null)
        ''');
        });
  }

  Future<void> replaceDetections(List<ObjectDetection> detections) {
    return db.delete(ObjectDetectionEntity.table).then((_) async {
      for (var detection in detections) {
        await db.insert(ObjectDetectionEntity.table,
            ObjectDetectionEntity.from(detection).toMap());
      }
    });
  }

  Future<void> insert(ObjectDetection classification) async {
    await db.insert(ObjectDetectionEntity.table,
        ObjectDetectionEntity.from(classification).toMap());
  }

  Future<ObjectDetection> getDetection(String id) async {
    List<Map> maps = await db.query(ObjectDetectionEntity.table,
        columns: [
          ObjectDetectionEntity.columnId,
          ObjectDetectionEntity.columnImageURL
        ],
        where: '${ObjectDetectionEntity.columnId} = ?',
        whereArgs: [id]);
    if (maps.length > 0) {
      return ObjectDetectionEntity.fromMap(maps.first);
    }
    return null;
  }

  Future<List<ObjectDetection>> getDetections() async {
    List<Map> maps = await db.query(ObjectDetectionEntity.table, columns: [
      ObjectDetectionEntity.columnId,
      ObjectDetectionEntity.columnImageURL
    ]);
    if (maps.length > 0) {
      return maps.map((item) => ObjectDetectionEntity.fromMap(item)).toList();
    }
    return null;
  }

  Future<void> delete(String id) async {
    await db.delete(ObjectDetectionEntity.table,
        where: '${ObjectDetectionEntity.columnId} = ?', whereArgs: [id]);
  }

  Future<int> update(ObjectDetection detection) async {
    return await db.update(ObjectDetectionEntity.table,
        ObjectDetectionEntity.from(detection).toMap(),
        where: '${ObjectDetectionEntity.columnId} = ?',
        whereArgs: [detection.id]);
  }

  Future close() async => db.close();
}
