import 'dart:async';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/screen/profile/profile_state.dart';

class ProfileBloc {
  Repository _repository = Repository();

  User _user;
  bool _isLoading = false;

  ProfileBloc() {
    _loadUser();
  }

  void uploadImage(File image) {
    _setState(ProfileState.uploadingPhoto(user: _user));
    _repository.uploadUserImage(image).then((res) {
      if (res.success) {
        print("Success");
        _loadUser();
      }
    }).catchError((err) {
      print("Failed");
      print(err.message);
    });
  }

  // State stream
  StreamController<ProfileState> _stateController =
      StreamController<ProfileState>();

  Stream<ProfileState> get state => _stateController.stream;

  void _loadUser() {
    if (_isLoading) return;
    _isLoading = true;
    _setState(ProfileState.loading(user: _user));
    _repository.usersInfoLocal().then((user) {
      this._user = user;
      _setState(ProfileState.loading(user: _user));
    });
    _repository.usersInfo().then((user) {
      this._user = user;
      _setState(ProfileState.success(_user));
      _isLoading = false;
    }).catchError((err) {
      if (err is DioError) {
        _setState(ProfileState.error(err.message.toString(), user: _user));
      } else {
        _setState(ProfileState.error(err.toString(), user: _user));
      }
      _isLoading = false;
    });
  }

  _setState(ProfileState state) {
    if (!_stateController.isClosed) _stateController.add(state);
  }

  void dispose() {
    _stateController.close();
  }
}
