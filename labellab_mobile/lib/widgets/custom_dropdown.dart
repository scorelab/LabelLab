import 'package:flutter/material.dart';

class CustomDropdown extends StatefulWidget {
  final List<String> options;
  final Function callback;
  final bool isDisabled;

  CustomDropdown(this.options, this.callback, {this.isDisabled = false});

  @override
  _CustomDropdownState createState() => _CustomDropdownState();
}

class _CustomDropdownState extends State<CustomDropdown> {
  String _selectedOption = "";

  @override
  void initState() {
    setState(() {
      _selectedOption = widget.options[0];
      widget.callback(_selectedOption);
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
                setState(
                  () {
                    _selectedOption = value!;
                    widget.callback(_selectedOption);
                  },
                );
              },
      ),
    );
  }
}
