import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/home/camera_button.dart';
import 'package:labellab_mobile/screen/home/nav_item.dart';
import 'package:labellab_mobile/screen/home/user_detail_loading.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: <Widget>[
          _buildGradient(),
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
                  _goToClassify(context, true);
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

  Widget _buildGradient() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.bottomCenter,
          end: Alignment.topCenter,
          stops: [0.1, 0.9],
          colors: [
            Colors.teal[800]!.withAlpha(100),
            Colors.teal[400]!.withAlpha(40),
          ],
        ),
      ),
    );
  }

  Widget _buildTopNav(BuildContext context) {
    final _authState = Provider.of<AuthState>(context, listen: false);
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
              : NavItem(
                  icon: Icons.settings,
                  label: 'Settings',
                  onTap: () => _goToBackendServiceSelection(context),
                ),
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
      onPressed: () {
        _goToClassify(context, false);
      },
    );
  }

  Widget _buildUserDetails(BuildContext context) {
    final _authState = Provider.of<AuthState>(context, listen: false);
    if (_authState.isAuthenticated) {
      User user = _authState.user!;
      return Card(
        child: ListTile(
          leading: CircleAvatar(
            backgroundColor: Colors.black12,
            child: ClipOval(
              child: user.thumbnail != null
                  ? Image(
                      height: 48,
                      width: 48,
                      image: CachedNetworkImageProvider(user.thumbnail!),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
          ),
          title: Text(user.name!),
          subtitle: Text(user.email!),
          onTap: () => _goToProfile(context),
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
      return UserDetailLoading();
    }
  }

  void _goToPage(BuildContext context, int page) {
    Provider.of<PageController>(context, listen: false).animateToPage(
      page,
      duration: Duration(milliseconds: 420),
      curve: ElasticOutCurve(),
    );
  }

  void _goToProfile(BuildContext context) {
    Application.router.navigateTo(context, "/profile");
  }

  void _goToClassify(BuildContext context, bool isCamera) {
    Application.router
        .navigateTo(context, '/classify/' + (isCamera ? 'camera' : "gallery"));
  }

  void _goToBackendServiceSelection(BuildContext context) {
    Application.router.navigateTo(context, "/backend-selection");
  }
}
