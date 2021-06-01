import 'package:flutter/material.dart';

class LabelTextFormField extends StatefulWidget {
  final Key? key;
  final String? hintText;
  final String? labelText;
  final String? errorText;
  final bool isObscure;
  final TextCapitalization textCapitalization;
  final TextInputType keyboardType;
  final validator;
  final onSaved;
  final TextEditingController? controller;

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
    this.controller,
  });

  @override
  _LabelTextFormFieldState createState() => _LabelTextFormFieldState();
}

class _LabelTextFormFieldState extends State<LabelTextFormField> {
  bool _textShown = true;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: TextFormField(
        controller: widget.controller,
        key: widget.key,
        decoration: new InputDecoration(
          hintText: widget.hintText,
          labelText: widget.labelText,
          errorText: widget.errorText,
          labelStyle: TextStyle(color: Colors.black45),
          filled: true,
          fillColor: Colors.black12,
          border: InputBorder.none,
          suffixIcon: widget.isObscure
              ? GestureDetector(
                  onTap: () => setState(() => _textShown = !_textShown),
                  child: Icon(
                    _textShown ? Icons.visibility : Icons.visibility_off,
                    size: 20,
                    color: Colors.black45,
                  ),
                )
              : null,
        ),
        textCapitalization: widget.textCapitalization,
        keyboardType: widget.keyboardType,
        obscureText: widget.isObscure ? _textShown : widget.isObscure,
        validator: (String? value) {
          if (value != null) widget.validator(value);
        },
        onSaved: (String? value) {
          if (value != null) widget.onSaved(value);
        },
      ),
    );
  }
}
