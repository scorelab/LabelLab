import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:labellab_mobile/model/auth_user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/login/github_signin_screen.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:labellab_mobile/widgets/label_text_form_field.dart';
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
                      LabelTextFormField(
                        labelText: "Email",
                        onSaved: (String value) {
                          _user.email = value;
                        },
                        validator: _validateEmail,
                      ),
                      SizedBox(
                        height: 16,
                      ),
                      LabelTextFormField(
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
                      Builder(
                        builder: (context) => RaisedButton(
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
                          onPressed: !_isLoginIn
                              ? () {
                                  _onSubmit(context);
                                }
                              : null,
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  child: Center(child: Text("or")),
                ),
                Builder(
                  builder: (context) => SignInButton(
                    Buttons.GoogleDark,
                    onPressed: () =>
                        !_isLoginIn ? _signInWithGoogle(context) : null,
                  ),
                ),
                Builder(
                  builder: (context) => SignInButton(
                    Buttons.GitHub,
                    onPressed: () =>
                        !_isLoginIn ? _signInWithGithub(context) : null,
                  ),
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
    } else if (!RegExp(
            r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$")
        .hasMatch(email)) {
      return "Invalid email";
    }
    return null;
  }

  String _validatePassword(String password) {
    if (password.isEmpty) {
      return "Password can't be empty";
    }
    return null;
  }

  void _onSubmit(BuildContext context) {
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
        _showAuthFailSnackbar(context);
      });
    }
  }

  void _signInWithGoogle(BuildContext context) {
    setState(() {
      _isLoginIn = true;
    });
    Provider.of<AuthState>(context).signInWithGoogle().then((success) {
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
      _showAuthFailSnackbar(context);
    });
  }

  void _signInWithGithub(BuildContext context) {
    setState(() {
      _isLoginIn = true;
    });
    Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (context) => GithubSigninScreen()),
    ).then((String code) {
      if (code != null) {
        Provider.of<AuthState>(context).signInWithGitHub(code).then((success) {
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
        });
      } else {
        setState(() {
          _isLoginIn = false;
        });
        _showAuthFailSnackbar(context);
      }
    });
  }

  void _onCreateAccount() {
    Application.router.navigateTo(context, "/signup");
  }

  void _showAuthFailSnackbar(BuildContext context) {
    Scaffold.of(context).showSnackBar(SnackBar(
      content: Text("Sign in failed"),
      backgroundColor: Colors.redAccent,
    ));
  }
}
