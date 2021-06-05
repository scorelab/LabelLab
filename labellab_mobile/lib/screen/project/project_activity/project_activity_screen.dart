import 'package:flutter/material.dart';

class ProjectActivityScreen extends StatelessWidget {
  final String projectId;

  ProjectActivityScreen(this.projectId);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(projectId),
      ),
    );
  }
}
