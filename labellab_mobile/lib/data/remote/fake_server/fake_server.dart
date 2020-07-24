import 'package:labellab_mobile/data/remote/dto/time_value.dart';
import 'package:labellab_mobile/model/group.dart';
import 'package:labellab_mobile/model/image.dart';
import 'package:charts_flutter/flutter.dart' as charts;

class FakeServer {
  Group _instanceGroup;

  List<charts.Series> _results;

  void initGroup(String projectId, List<Image> images) {
    _instanceGroup.projectId = projectId;
    _instanceGroup.images = [images.first, images.last];

    initResults();
  }

  Group get getGroup => _instanceGroup;

  List<Group> get getGroups => [_instanceGroup];

  void initResults() {
    List<TimeValue> data = [
      TimeValue(DateTime(2020, 11, 1), 10),
    ];

    _results = [
      charts.Series<TimeValue, DateTime>(
        id: 'Values',
        colorFn: (_, __) => charts.MaterialPalette.blue.shadeDefault,
        domainFn: (TimeValue _, __) => _.stamp,
        measureFn: (TimeValue _, __) => _.value,
        data: data,
      )
    ];
  }

  List<charts.Series> get getResults => _results;

  // Singleton

  FakeServer._internal() {
    _instanceGroup = Group(id: "id", name: "mock group");
  }

  static final FakeServer _fakeServer = FakeServer._internal();

  factory FakeServer() => _fakeServer;
}
