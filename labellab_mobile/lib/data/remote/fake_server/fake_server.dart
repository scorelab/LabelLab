import 'package:labellab_mobile/model/group.dart';
import 'package:labellab_mobile/model/image.dart';

class FakeServer {
  Group _instanceGroup;

  void initGroup(String projectId, List<Image> images) {
    _instanceGroup.projectId = projectId;
    _instanceGroup.images = [images.first, images.last];
  }

  Group get getGroup => _instanceGroup;

  List<Group> get getGroups => [_instanceGroup];

  // Singleton

  FakeServer._internal() {
    _instanceGroup = Group(id: "id", name: "mock group");
  }

  static final FakeServer _fakeServer = FakeServer._internal();

  factory FakeServer() => _fakeServer;
}
