import 'package:labellab_mobile/model/message.dart';

class ChatScreenState {
  late bool isLoading;
  List<Message>? messages;
  String? error;

  ChatScreenState.loading() {
    isLoading = true;
  }

  ChatScreenState.error(this.error) {
    this.isLoading = false;
  }

  ChatScreenState.success(this.messages) {
    this.isLoading = false;
  }

  ChatScreenState.setMessage(this.messages) {
    this.isLoading = false;
  }
}
