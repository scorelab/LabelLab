import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart';

import 'package:labellab_mobile/model/message.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/screen/project/chat/chat_screen_state.dart';
import 'package:labellab_mobile/screen/backend_selection/backend_service_selector.dart';

class ChatScreenBloc {
  String? _teamId;
  String? _userId;
  Socket? _socket;
  List<Message>? _messages;
  Repository _repository = Repository();

  ChatScreenBloc(this._teamId, this._userId) {
    _getPreviousMessages();
  }

  void _getPreviousMessages() {
    _repository.getChatroomMessages(_teamId!).then((msgs) {
      _messages = msgs;
      _connectSocket();
    });
  }

  void _connectSocket() async {
    try {
      String? url =
          await BackendServiceSelector().getBackendURLFromLocalStorage();
      // Configure socket
      _socket = io(url!, <String, dynamic>{
        'transports': ['websocket'],
        'autoConnect': false,
      });

      // Connect to websocket
      _socket!.connect();

      // Set state after connecting
      _socket!.on('connect', (_) {
        print('Connected ${_socket!.id}');
        _setState(ChatScreenState.success(_messages));
      });

      // Handler recieve message event
      _socket!.on('receive_message', _handleMessageRecieve);
    } catch (e) {
      print(e.toString());
      _setState(ChatScreenState.error(e.toString()));
    }
  }

  StreamController<ChatScreenState> _stateController =
      StreamController<ChatScreenState>();
  Stream<ChatScreenState> get state => _stateController.stream;

  void dispose() {
    _stateController.close();
    _socket!.close();
  }

  _setState(ChatScreenState state) {
    if (!_stateController.isClosed) _stateController.add(state);
  }

  void _handleMessageRecieve(data) {
    Message message = Message.fromJson(data as Map<String, dynamic>);
    if (message.teamId == _teamId) {
      _messages!.insert(0, message);
      _setState(ChatScreenState.setMessage(_messages));
    }
  }

  void sendMessage(String message) {
    final data = {
      'team_id': _teamId,
      'user_id': _userId,
      'body': message,
    };
    _socket!.emit('send_message', data);
  }

  String getUserId() {
    return _userId!;
  }
}
