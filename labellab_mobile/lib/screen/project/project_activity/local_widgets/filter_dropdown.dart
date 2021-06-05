import 'package:flutter/material.dart';

class FilterDropdown extends StatefulWidget {
  final List<String> options;
  final Function callback;
  final bool isDisabled;

  FilterDropdown(this.options, this.callback, {this.isDisabled = false});

  @override
  _FilterDropdownState createState() => _FilterDropdownState();
}

class _FilterDropdownState extends State<FilterDropdown> {
  String _selectedOption = "";

  @override
  void initState() {
    setState(() {
      _selectedOption = widget.options[0];
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7.5),
      child: DropdownButton<String>(
        isExpanded: true,
        hint: Text(
          _selectedOption,
          style: TextStyle(
            fontSize: 16,
            color: Colors.black.withOpacity(0.8),
          ),
        ),
        items: widget.options.map((String value) {
          return new DropdownMenuItem<String>(
            value: value,
            child: new Text(value),
          );
        }).toList(),
        onChanged: widget.isDisabled
            ? null
            : (value) {
                setState(() {
                  _selectedOption = value!;
                  widget.callback(_selectedOption);
                });
              },
      ),
    );
  }
}
