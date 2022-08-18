import 'package:flutter/material.dart';

class ColoredBox extends StatelessWidget {
  final String? text;
  final IconData? icon;
  final Color? textColor;
  final Color? backgroundColor;
  final bool? isCustomized;

  const ColoredBox(this.text, this.icon, this.textColor, this.backgroundColor, this.isCustomized);

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Container(
        height: 30,
        width: isCustomized! ? size.width * 0.3 : size.width * 0.28,
        decoration: BoxDecoration(
          color: isCustomized!
              ? backgroundColor!.withOpacity(0.3)
              : Colors.teal.withOpacity(0.3),
          border: Border.all(
            width: 1,
            color: isCustomized! ? backgroundColor! : Colors.teal,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.only(left: 4),
          child: Row(
            children: [
              Icon(
                icon,
                size: 20,
                color: isCustomized! ? textColor : Colors.teal,
              ),
              SizedBox(
                width: 4,
              ),
              Text(
                text!,
                style:
                    TextStyle(color: isCustomized! ? textColor : Colors.teal),
              )
            ],
          ),
        ));
  }
}
