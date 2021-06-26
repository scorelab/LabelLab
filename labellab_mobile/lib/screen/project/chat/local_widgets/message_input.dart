import 'package:flutter/material.dart';

class MessageInput extends StatelessWidget {
  final TextEditingController controller;
  final Function onSubmit;

  MessageInput(this.controller, this.onSubmit);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(10.0),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.black.withOpacity(0.8), width: 0.4),
        borderRadius: BorderRadius.circular(25),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Expanded(
            child: ConstrainedBox(
              constraints: new BoxConstraints(
                minHeight: 50,
                maxHeight: 100,
              ),
              child: SingleChildScrollView(
                scrollDirection: Axis.vertical,
                reverse: true,
                child: TextField(
                  cursorColor: Colors.grey,
                  controller: controller,
                  onSubmitted: (message) {
                    onSubmit(message);
                    controller.clear();
                  },
                  keyboardType: TextInputType.multiline,
                  maxLines: null,
                  decoration: InputDecoration(
                    contentPadding: EdgeInsets.symmetric(
                      vertical: 10.0,
                      horizontal: 20.0,
                    ),
                    hintText: 'Send a message',
                    border: InputBorder.none,
                    hintStyle: TextStyle(
                      color: Colors.grey[400],
                      fontFamily: 'Lato',
                    ),
                  ),
                ),
              ),
            ),
          ),
          IconButton(
            onPressed: () {
              onSubmit(controller.text);
              controller.clear();
            },
            icon: Icon(
              Icons.chevron_right_outlined,
              color: Colors.black.withOpacity(0.8),
              size: 30,
            ),
          ),
        ],
      ),
    );
  }
}
