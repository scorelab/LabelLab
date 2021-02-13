import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/team.dart';

class TeamItem extends StatelessWidget {
  final Team team;
  final Function onPress;

  TeamItem(this.team, {this.onPress});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onPress,
      child: Chip(
        padding: const EdgeInsets.all(10),
        label: Text(team.name),
        avatar: CircleAvatar(
          backgroundColor: Colors.black,
          child: Text(
            team.members.length.toString(),
            style: TextStyle(
              color: Colors.white,
              fontSize: 8,
            ),
          ),
        ),
      ),
    );
  }
}
