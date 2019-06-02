import 'package:flutter/material.dart';

class ProjectScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Projects"),
        centerTitle: true,
        elevation: 2,
      ),
      body: Text("Project"),
    );
  }
}
