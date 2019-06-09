import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:provider/provider.dart';

class ProfileScreen extends StatelessWidget {
  final Respository _repository = Respository();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Profile"),
        actions: <Widget>[
          PopupMenuButton(
            onSelected: (int value) {
              switch (value) {
                case 0:
                  _signOut(context);
                  break;
                default:
              }
            },
            itemBuilder: (context) => [
                  PopupMenuItem<int>(
                    child: Text("Logout"),
                    value: 0,
                  ),
                ],
          ),
        ],
      ),
      body: ListView(
        children: <Widget>[
          _userInfoSection(context),
        ],
      ),
    );
  }

  Widget _userInfoSection(BuildContext context) {
    return FutureBuilder<User>(
      future: _repository.usersInfo(),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          User _user = snapshot.data;
          return Column(
            children: <Widget>[
              SizedBox(
                height: 24,
              ),
              CircleAvatar(
                backgroundColor: Colors.black12,
                radius: 64,
              ),
              SizedBox(
                height: 16,
              ),
              Text(
                _user.name,
                style: Theme.of(context).textTheme.title,
              ),
              SizedBox(
                height: 8,
              ),
              Text(
                _user.email,
                style: Theme.of(context).textTheme.subhead,
              ),
            ],
          );
        } else {
          return Container();
        }
      },
    );
  }

  void _signOut(BuildContext context) {
    Provider.of<AuthState>(context).signout().then((_) {
      Application.router.pop(context);
    });
  }
}
