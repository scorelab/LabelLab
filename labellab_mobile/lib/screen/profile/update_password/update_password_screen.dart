import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/widgets/label_text_form_field.dart';

class UpdatePasswordScreen extends StatefulWidget {
  @override
  _UpdatePasswordScreenState createState() => _UpdatePasswordScreenState();
}

class _UpdatePasswordScreenState extends State<UpdatePasswordScreen> {
  GlobalKey<FormState> _key = GlobalKey();
  GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey();
  Repository _repository = Repository();

  bool _isUpdating = false;
  String _currentPassword = "", _newPassword = "", _confirmNewPassword = "";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: Text("Update Password"),
        centerTitle: true,
        elevation: 0,
      ),
      body: Container(
        padding: const EdgeInsets.symmetric(
          vertical: 10,
          horizontal: 15,
        ),
        child: Form(
          key: _key,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              LabelTextFormField(
                labelText: "Current Password",
                hintText: 'Enter your current password',
                validator: _validatePassword,
                isObscure: true,
                onSaved: (String value) {
                  _currentPassword = value;
                },
              ),
              SizedBox(
                height: 16,
              ),
              LabelTextFormField(
                labelText: "New Password",
                hintText: 'Enter your new password',
                validator: _validatePassword,
                isObscure: true,
                onSaved: (String value) {
                  _newPassword = value;
                },
              ),
              SizedBox(
                height: 16,
              ),
              LabelTextFormField(
                labelText: "Confirm new Password",
                hintText: 'Confirm your new password',
                validator: _validateConfirmPassword,
                isObscure: true,
                onSaved: (String value) {
                  _confirmNewPassword = value;
                },
              ),
              SizedBox(
                height: 16,
              ),
              ElevatedButton(
                key: Key("signup-button"),
                style: ElevatedButton.styleFrom(
                  elevation: 0,
                  primary: Theme.of(context).accentColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: EdgeInsets.symmetric(vertical: 16.0),
                ),
                child: _isUpdating
                    ? Text("Updating Password")
                    : Text("Update Password"),
                onPressed: !_isUpdating ? _updatePassword : null,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _updatePassword() {
    _key.currentState!.save();
    if (_key.currentState!.validate()) {
      _repository.updatePassword(_currentPassword, _newPassword).then((res) {
        if (res.success!) {
          Application.router.pop(context);
        } else {
          _showError(res.msg!);
        }
      }).catchError((err) {
        _showError(err.message);
      });
    }
  }

  String? _validatePassword(String password) {
    if (password.isEmpty) {
      return "Password can't be empty";
    } else if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  }

  String? _validateConfirmPassword(String password) {
    if (password.isEmpty || _newPassword != _confirmNewPassword) {
      return "Passwords doesn't match";
    }
    return null;
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.redAccent,
      ),
    );
  }
}
