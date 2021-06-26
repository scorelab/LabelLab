import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:labellab_mobile/widgets/empty_placeholder.dart';
import 'package:labellab_mobile/screen/project/chat/chat_screen_bloc.dart';
import 'package:labellab_mobile/screen/project/chat/chat_screen_state.dart';
import 'package:labellab_mobile/screen/project/chat/local_widgets/message_input.dart';
import 'package:labellab_mobile/screen/project/chat/local_widgets/messages_list.dart';

class ChatScreen extends StatefulWidget {
  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Chatroom'),
        centerTitle: true,
        elevation: 0,
      ),
      backgroundColor: Colors.grey[200],
      body: StreamBuilder<ChatScreenState>(
        initialData: ChatScreenState.loading(),
        stream: Provider.of<ChatScreenBloc>(context).state,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting ||
              !snapshot.hasData) {
            return _loadingIndicator(context);
          }
          final _state = snapshot.data;
          if (_state == null || _state.isLoading) {
            return _loadingIndicator(context);
          }
          return Column(
            children: [
              _state.messages != null && _state.messages!.isNotEmpty
                  ? MessagesList(_state.messages!)
                  : Expanded(
                      child: EmptyPlaceholder(
                        description: 'No messages yet',
                      ),
                    ),
              MessageInput(_controller, _sendMessage),
            ],
          );
        },
      ),
    );
  }

  Widget _loadingIndicator(BuildContext context) {
    return LinearProgressIndicator(
      backgroundColor: Theme.of(context).canvasColor,
    );
  }

  void _sendMessage(String text) {
    if (text.isEmpty) return;
    Provider.of<ChatScreenBloc>(context, listen: false).sendMessage(text);
  }
}
