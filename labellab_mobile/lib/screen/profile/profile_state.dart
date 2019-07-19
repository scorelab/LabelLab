import 'package:labellab_mobile/model/user.dart';

class ProfileState {
  bool isLoading = false;
  bool uploadingPhoto = false;
  String error;
  User user;

  ProfileState.loading({this.user}) {
    isLoading = true;
  }

  ProfileState.uploadingPhoto({this.user}) {
    uploadingPhoto = true;
  }

  ProfileState.error(this.error, {this.user});

  ProfileState.updateError(this.error, {this.user});

  ProfileState.success(this.user);
}