import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/home/camera_button.dart';
import 'package:labellab_mobile/screen/home/nav_item.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: <Widget>[
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SafeArea(child: _buildTopNav(context)),
          ),
          Column(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              CameraButton(
                onTap: () {
                  print("Sex");
                },
              ),
              SizedBox(height: 32),
              _buildGalleryButton(context),
            ],
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: _buildUserDetails(context),
          )
        ],
      ),
    );
  }

  Widget _buildTopNav(BuildContext context) {
    final _authState = Provider.of<AuthState>(context);
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          NavItem(
            icon: Icons.history,
            label: "History",
            onTap: () => _goToPage(context, 0),
          ),
          _authState.isAuthenticated
              ? NavItem(
                  icon: Icons.photo_library,
                  label: "Projects",
                  onTap: () => _goToPage(context, 2),
                )
              : Container(),
        ],
      ),
    );
  }

  Widget _buildGalleryButton(BuildContext context) {
    return FloatingActionButton(
      child: Icon(
        Icons.photo_library,
        color: Theme.of(context).accentColor,
      ),
      backgroundColor: Colors.white,
      elevation: 1,
      onPressed: () => {},
    );
  }

  Widget _buildUserDetails(BuildContext context) {
    final _authState = Provider.of<AuthState>(context);
    if (_authState.isAuthenticated) {
      User user = _authState.user;
      return Card(
        child: ListTile(
          leading: CircleAvatar(
            backgroundColor: Colors.blue,
          ),
          title: Text(user.name),
          subtitle: Text(user.email),
          trailing: IconButton(
            icon: Icon(Icons.exit_to_app),
            onPressed: () {
              Provider.of<AuthState>(context).signout();
            },
          ),
        ),
      );
    } else if (!_authState.isLoading) {
      return Card(
        child: ListTile(
          title: Text("Sign In"),
          subtitle: Text("Sync your history and access projects"),
          trailing: Icon(Icons.person_add),
          onTap: () {
            Application.router.navigateTo(context, "/login");
          },
        ),
      );
    } else {
      return Container();
    }
  }

  void _goToPage(BuildContext context, int page) {
    Provider.of<PageController>(context).animateToPage(
      page,
      duration: Duration(milliseconds: 420),
      curve: ElasticOutCurve(),
    );
  }
}
