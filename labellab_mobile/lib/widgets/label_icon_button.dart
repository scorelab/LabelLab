import 'package:flutter/material.dart';

class LabelIconButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onTap;

  LabelIconButton(this.icon, this.label,
      {this.onTap, this.color = Colors.black});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Column(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Icon(
              icon,
              size: 28,
              color: onTap == null ? color.withAlpha(80) : color,
            ),
            Text(
              label,
              style: TextStyle(
                  color: onTap == null ? color.withAlpha(80) : color,
                  fontSize: 12),
            ),
          ],
        ),
      ),
      onTap: onTap,
    );
  }
}
