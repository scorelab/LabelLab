import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/message.dart';
import 'package:labellab_mobile/screen/project/chat/chat_screen_bloc.dart';
import 'package:labellab_mobile/screen/project/chat/local_widgets/message_bubble.dart';
import 'package:provider/provider.dart';

class MessagesList extends StatelessWidget {
  final List<Message> messages;

  MessagesList(this.messages);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: ListView.builder(
        reverse: true,
        itemBuilder: (ctx, index) =>
            MessageBubble(messages[index], _getCurrentUserId(context)),
        itemCount: messages.length,
      ),
    );
  }

  String _getCurrentUserId(BuildContext context) {
    String userId = Provider.of<ChatScreenBloc>(context).getUserId();
    return userId;
  }
}
