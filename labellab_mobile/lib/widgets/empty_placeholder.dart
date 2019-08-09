import 'package:flutter/material.dart';

class EmptyPlaceholder extends StatelessWidget {
  final String description;

  EmptyPlaceholder({this.description = ""});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            SizedBox(
              height: 36,
            ),
            Icon(
              Icons.error_outline,
              size: 96,
              color: Colors.black26,
            ),
            SizedBox(
              height: 8,
            ),
            Text(
              "Hm, Nothing here...",
              style: TextStyle(color: Colors.black38, fontSize: 24),
            ),
            SizedBox(
              height: 8,
            ),
            Text(
              description,
              style: TextStyle(color: Colors.black87),
            ),
            SizedBox(
              height: 36,
            ),
          ],
        ),
      ],
    );
  }
}
