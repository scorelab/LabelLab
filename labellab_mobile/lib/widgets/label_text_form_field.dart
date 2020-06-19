import 'package:flutter/material.dart';

class LabelTextFormField extends StatelessWidget {
  final Key key;
  final String hintText;
  final String labelText;
  final String errorText;
  final bool isObscure;
  final TextCapitalization textCapitalization;
  final TextInputType keyboardType;
  final validator;
  final onSaved;

  LabelTextFormField({
    this.key,
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
        key: key,
        decoration: new InputDecoration(
          hintText: hintText,
          labelText: labelText,
          errorText: errorText,
          labelStyle: TextStyle(color: Colors.black45),
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
