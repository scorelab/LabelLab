import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatefulWidget {
  LoginScreen({Key key}) : super(key: key);

  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  GlobalKey<FormState> _key = GlobalKey();

  bool _isLoginIn = false;
  AuthUser _user = AuthUser.just();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(""),
        elevation: 0,
        backgroundColor: Theme.of(context).canvasColor,
      ),
      body: Theme(
        data: Theme.of(context)
            .copyWith(primaryColor: Theme.of(context).accentColor),
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.only(left: 16.0, right: 16, top: 54),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Text(
                  "Sign In",
                  style: Theme.of(context).textTheme.headline,
                ),
                Form(
                  key: _key,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      SizedBox(
                        height: 16,
                      ),
                      LabelTextField(
                        labelText: "Email",
                        onSaved: (String value) {
                          _user.email = value;
                        },
                        validator: _validateEmail,
                      ),
                      SizedBox(
                        height: 16,
                      ),
                      LabelTextField(
                        labelText: "Password",
                        isObscure: true,
                        onSaved: (String value) {
                          _user.password = value;
                        },
                        validator: _validatePassword,
                      ),
                      SizedBox(
                        height: 16,
                      ),
                      RaisedButton(
                        elevation: 0,
                        color: Theme.of(context).accentColor,
                        colorBrightness: Brightness.dark,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: EdgeInsets.symmetric(vertical: 16.0),
                        child: _isLoginIn
                            ? Text("Signing In...")
                            : Text("Sign In"),
                        onPressed: _isLoginIn ? null : _onSubmit,
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  child: Center(child: Text("or")),
                ),
                SignInButton(
                  Buttons.GoogleDark,
                  onPressed: () {},
                ),
                SignInButton(
                  Buttons.GitHub,
                  onPressed: () {},
                ),
                SizedBox(
                  height: 16,
                ),
                FlatButton(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: EdgeInsets.symmetric(vertical: 16.0),
                  child: Text("or Create an account?"),
                  onPressed: _onCreateAccount,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _validateEmail(String email) {
    if (email.isEmpty) {
      return "Email can't be empty";
    }
    return null;
  }

  String _validatePassword(String password) {
    if (password.isEmpty) {
      return "Password can't be empty";
    }
    return null;
  }

  void _onSubmit() {
    if (_key.currentState.validate()) {
      _key.currentState.save();

      setState(() {
        _isLoginIn = true;
      });
      Provider.of<AuthState>(context).signin(_user).then((success) {
        if (success) {
          Application.router.pop(context);
        } else {
          setState(() {
            _isLoginIn = false;
          });
        }
      }).catchError((err) {
        setState(() {
          _isLoginIn = false;
        });
        print(err.toString());
        // Scaffold.of(context).showSnackBar(SnackBar(
        //   content: Text("Sign in failed!"),
        // ));
      });
    }
  }

  void _onCreateAccount() {
    Application.router.navigateTo(context, "/signup");
  }
}
