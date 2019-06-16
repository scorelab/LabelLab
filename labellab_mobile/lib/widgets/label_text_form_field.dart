import 'package:flutter/material.dart';

class LabelTextFormField extends StatelessWidget {
  final String hintText;
  final String labelText;
  final String errorText;
  final bool isObscure;
  final TextCapitalization textCapitalization;
  final TextInputType keyboardType;
  final validator;
  final onSaved;

  LabelTextFormField({
    this.hintText,
    this.errorText,
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
          errorText: errorText,
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
