import 'package:flutter/material.dart';

class LoadingProgress extends StatelessWidget {
  final Color color;

  LoadingProgress({this.color = Colors.white});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 18,
      height: 18,
      child: CircularProgressIndicator(
        valueColor: new AlwaysStoppedAnimation(color),
        strokeWidth: 2,
      ),
    );
  }
}
