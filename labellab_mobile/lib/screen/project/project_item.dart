import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/project.dart';

class ProjectItem extends StatelessWidget {
  final Project project;
  final VoidCallback onEditSelected;
  final VoidCallback onDeleteSelected;

  const ProjectItem(this.project,
      {Key key, this.onDeleteSelected, this.onEditSelected})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(project.name),
      trailing: PopupMenuButton<int>(
        onSelected: (int selected) {
          switch (selected) {
            case 0:
              if (onEditSelected != null) onEditSelected();
              break;
            case 1:
              if (onDeleteSelected != null) onDeleteSelected();
              break;
          }
        },
        itemBuilder: (context) {
          return [
            PopupMenuItem(
              value: 0,
              child: Text("Edit"),
            ),
            PopupMenuItem(
              value: 1,
              child: Text("Delete"),
            )
          ];
        },
      ),
    );
  }
}
