import 'package:flutter/material.dart';

class LabelTextField extends StatelessWidget {
  final String hintText;
  final String labelText;
  final bool isObscure;
  final TextCapitalization textCapitalization;
  final TextInputType keyboardType;
  final validator;
  final onSaved;

  LabelTextField({
    this.hintText,
    this.isObscure = false,
    this.textCapitalization = TextCapitalization.none,
    this.keyboardType = TextInputType.text,
    this.labelText,
    this.validator,
    this.onSaved,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: TextFormField(
        decoration: new InputDecoration(
          hintText: hintText,
          labelText: labelText,
          filled: true,
          fillColor: Colors.black12,
          border: InputBorder.none,
        ),
        textCapitalization: textCapitalization,
        keyboardType: keyboardType,
        obscureText: isObscure,
        validator: validator,
        onSaved: onSaved,
      ),
    );
  }
}
