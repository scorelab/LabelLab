import 'package:google_sign_in/google_sign_in.dart';

class GoogleUserRequest {
  String? id;
  String? displayName;
  String? photoUrl;
  String? email;
  String? accessToken;

  GoogleUserRequest(GoogleSignInAccount user, this.accessToken) {
    this.id = user.id;
    this.displayName = user.displayName;
    this.photoUrl = user.photoUrl;
    this.email = user.email;
  }

  Map<String, dynamic> toMap() {
    return {
      "id": id,
      "displayName": displayName,
      "photoUrl": photoUrl,
      "email": email,
      "accessToken": accessToken
    };
  }
}
