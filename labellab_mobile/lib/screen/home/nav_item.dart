import 'package:flutter/material.dart';

class NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onTap;

  NavItem({
    required this.icon,
    required this.label,
    this.color = Colors.black,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.all(4.0),
        child: Container(
          width: 54,
          height: 54,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Icon(
                icon,
                color: color,
              ),
              SizedBox(
                height: 4,
              ),
              Text(
                label,
                style: TextStyle(color: color),
              ),
            ],
          ),
        ),
      ),
      onTap: onTap,
    );
  }
}
