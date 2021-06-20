import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/team.dart';

class TeamItem extends StatelessWidget {
  final Team team;
  final Function onClick;

  TeamItem(this.team, this.onClick);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => onClick(context, team.projectId!, team.id!),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(50),
        ),
        margin: const EdgeInsets.only(top: 10, bottom: 10, right: 2.5),
        padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 10),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_capitalize(team.name!)),
            SizedBox(width: 5),
            Icon(_getIcon(team.role!))
          ],
        ),
      ),
    );
  }

  String _capitalize(String s) {
    return s[0].toUpperCase() + s.substring(1);
  }

  IconData _getIcon(String role) {
    switch (role) {
      case 'images':
        return Icons.image;
      case 'labels':
        return Icons.label;
      case 'image labelling':
        return Icons.image_search_rounded;
      case 'models':
        return Icons.model_training;
      case 'admin':
        return Icons.people_alt;
      default:
        return Icons.people;
    }
  }
}
