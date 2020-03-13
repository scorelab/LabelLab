import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/project.dart';

class ProjectItem extends StatelessWidget {
  final Project project;
  final VoidCallback onItemTapped;
  final VoidCallback onEditSelected;
  final VoidCallback onDeleteSelected;
  final bool shouldHaveOptions;

  const ProjectItem(this.project,
      {Key key, this.onItemTapped, this.onDeleteSelected, this.onEditSelected, this.shouldHaveOptions = true})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(project.name),
      trailing: shouldHaveOptions ? PopupMenuButton<int>(
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
      ) : null,
      onTap: this.onItemTapped,
    );
  }
}
