import 'package:flutter/material.dart';

class LabelDropdown extends StatelessWidget {
  final String label;
  final String value;
  final List<String> items;
  final Function onChange;

  LabelDropdown({
    this.label,
    this.value,
    this.items,
    this.onChange,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 10,
        vertical: 5,
      ),
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Colors.black12,
        borderRadius: BorderRadius.circular(8),
      ),
      child: DropdownButton(
        isExpanded: true,
        items: items
            .map(
              (item) => DropdownMenuItem(
                child: Text(
                  item[0].toUpperCase() + item.substring(1),
                  style: TextStyle(color: Colors.black45),
                ),
                onTap: () => onChange(item),
                value: item,
              ),
            )
            .toList(),
        hint: Text(
          label,
          style: TextStyle(color: Colors.black45),
        ),
        focusColor: Colors.black12,
        onChanged: (value) => onChange(value),
        value: value,
      ),
    );
  }
}
