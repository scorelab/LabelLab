import 'package:flutter/material.dart';

import 'package:labellab_mobile/model/message.dart';

class MessageBubble extends StatelessWidget {
  final Message message;
  final String userId;

  MessageBubble(this.message, this.userId);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(
        top: 10,
        left: userId == message.userId ? 0 : 10,
        right: userId == message.userId ? 10 : 0,
      ),
      width: MediaQuery.of(context).size.width,
      alignment: userId == message.userId
          ? Alignment.centerRight
          : Alignment.centerLeft,
      child: Container(
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: userId == message.userId
              ? Theme.of(context).accentColor.withOpacity(0.5)
              : Theme.of(context).accentColor.withOpacity(0.9),
          borderRadius: BorderRadius.circular(25),
        ),
        width: MediaQuery.of(context).size.width * 0.6,
        child: Column(
          children: <Widget>[
            Container(
              alignment: userId == message.userId
                  ? Alignment.bottomRight
                  : Alignment.bottomLeft,
              child: Row(
                mainAxisAlignment: userId == message.userId
                    ? MainAxisAlignment.end
                    : MainAxisAlignment.start,
                children: <Widget>[
                  Text(
                    userId == message.userId ? 'You ' : message.username!,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white.withOpacity(0.7),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 7),
            Container(
              alignment: userId == message.userId
                  ? Alignment.centerRight
                  : Alignment.centerLeft,
              child: Text(
                message.body!,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.white,
                ),
              ),
            ),
            SizedBox(height: 5),
            Container(
              alignment: userId == message.userId
                  ? Alignment.bottomRight
                  : Alignment.bottomLeft,
              child: Row(
                mainAxisAlignment: userId == message.userId
                    ? MainAxisAlignment.end
                    : MainAxisAlignment.start,
                children: <Widget>[
                  Text(
                    message.timestamp!,
                    style: TextStyle(
                      fontSize: 10,
                      color: Colors.white.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
