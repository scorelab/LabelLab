import 'dart:io';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/profile/profile_bloc.dart';
import 'package:labellab_mobile/screen/profile/profile_state.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:provider/provider.dart';

class ProfileScreen extends StatelessWidget {
  final ImagePicker _imagePicker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Profile"),
        elevation: 0,
        actions: <Widget>[
          PopupMenuButton(
            onSelected: (int value) {
              switch (value) {
                case 0:
                  _showChangePictureMethodSelect(context);
                  break;
                case 1:
                  _goToEditInfo(context);
                  break;
                case 2:
                  _goToUpdatePassword(context);
                  break;
                case 3:
                  _signOut(context);
                  break;
                default:
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem<int>(
                child: Text("Change picture"),
                value: 0,
              ),
              PopupMenuItem<int>(
                child: Text("Edit info"),
                value: 1,
              ),
              PopupMenuItem<int>(
                child: Text("Update password"),
                value: 2,
              ),
              PopupMenuItem<int>(
                child: Text("Logout"),
                value: 3,
              ),
            ],
          ),
        ],
      ),
      body: StreamBuilder<ProfileState>(
          stream: Provider.of<ProfileBloc>(context).state,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              ProfileState _state = snapshot.data;
              return ListView(
                children: <Widget>[
                  _state.isLoading
                      ? LinearProgressIndicator(
                          backgroundColor: Theme.of(context).canvasColor,
                        )
                      : Container(
                          height: 6,
                        ),
                  _userInfoSection(context, _state),
                ],
              );
            } else {
              return Container();
            }
          }),
    );
  }

  Widget _userInfoSection(BuildContext context, ProfileState state) {
    final User user = state.user;
    return Column(
      children: <Widget>[
        SizedBox(
          height: 24,
        ),
        Stack(
          alignment: AlignmentDirectional.center,
          children: <Widget>[
            CircleAvatar(
              backgroundColor: Colors.black12,
              radius: 64,
              child: ClipOval(
                child: user.thumbnail != null
                    ? Image(
                        width: 128,
                        height: 128,
                        image: CachedNetworkImageProvider(user.thumbnail),
                        fit: BoxFit.cover,
                      )
                    : null,
              ),
            ),
            state.uploadingPhoto ? CircularProgressIndicator() : Container(),
          ],
        ),
        SizedBox(
          height: 16,
        ),
        Text(
          user.name,
          style: Theme.of(context).textTheme.headline6,
        ),
        SizedBox(
          height: 8,
        ),
        Text(
          user.email,
          style: Theme.of(context).textTheme.subtitle1,
        ),
        SizedBox(
          height: 8,
        ),
        Text(
          user.username,
          style: Theme.of(context).textTheme.subtitle1,
        ),
      ],
    );
  }

  void _signOut(BuildContext context) {
    Provider.of<AuthState>(context).signout().then((_) {
      Application.router.pop(context);
    });
  }

  void _goToEditInfo(BuildContext context) async {
    String username = Provider.of<ProfileBloc>(context).getUsername();
    Application.router
        .navigateTo(context, "/editinfo/" + username)
        .whenComplete(() {
      Provider.of<ProfileBloc>(context).refresh();
    });
  }

  void _goToUpdatePassword(BuildContext context) {
    Application.router.navigateTo(context, "/update-password");
  }

  void _showChangePictureMethodSelect(BuildContext pageContext) {
    showDialog(
      context: pageContext,
      builder: (context) => AlertDialog(
        title: Text("Choose method"),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        elevation: 8,
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            ListTile(
              leading: Icon(Icons.camera),
              title: Text("Camera"),
              onTap: () => _showImagePicker(context, ImageSource.camera),
            ),
            ListTile(
              leading: Icon(Icons.photo_library),
              title: Text("Gallery"),
              onTap: () => _showImagePicker(pageContext, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );
  }

  void _showImagePicker(BuildContext context, ImageSource source) {
    _imagePicker.getImage(source: source).then((image) {
      if (image != null) {
        File imageFile = File(image.path);
        Provider.of<ProfileBloc>(context).uploadImage(imageFile);
        Navigator.pop(context);
      }
    });
  }
}
