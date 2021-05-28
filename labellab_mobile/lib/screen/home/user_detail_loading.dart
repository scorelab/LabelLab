import 'package:flutter/material.dart';

class UserDetailLoading extends StatelessWidget {
  const UserDetailLoading({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(backgroundColor: Colors.black26),
        title: Row(
          children: <Widget>[
            Expanded(
              child: Container(
                margin: EdgeInsets.only(right: 64),
                color: Colors.black12,
                child: Text(""),
              ),
            ),
          ],
        ),
        subtitle: Row(
          children: <Widget>[
            Expanded(
              child: Container(
                margin: EdgeInsets.only(right: 96),
                color: Colors.black12,
                child: Text(""),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
