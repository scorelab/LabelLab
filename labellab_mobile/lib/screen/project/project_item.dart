import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/project.dart';

class ProjectItem extends StatelessWidget {
  final Project project;

  const ProjectItem(this.project, {Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(project.name),
    );
  }
}
