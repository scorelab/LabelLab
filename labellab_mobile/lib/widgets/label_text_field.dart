import 'package:flutter/material.dart';

class LabelTextField extends StatelessWidget {
  final TextEditingController? controller;
  final String? hintText;
  final String? labelText;
  final String? errorText;
  final bool isObscure;
  final TextCapitalization textCapitalization;
  final TextInputType keyboardType;
  final onSubmit;
  final onChange;

  LabelTextField({
    this.controller,
    this.hintText,
    this.errorText,
    this.isObscure = false,
    this.textCapitalization = TextCapitalization.none,
    this.keyboardType = TextInputType.text,
    this.labelText,
    this.onSubmit,
    this.onChange
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: TextField(
        controller: controller,
        decoration: new InputDecoration(
          hintText: hintText,
          labelText: labelText,
          labelStyle: TextStyle(color: Colors.black45),
          errorText: errorText,
          filled: true,
          fillColor: Colors.black12,
          border: InputBorder.none,
        ),
        textCapitalization: textCapitalization,
        keyboardType: keyboardType,
        obscureText: isObscure,
        onSubmitted: onSubmit,
        onChanged: onChange,
      ),
    );
  }
}
