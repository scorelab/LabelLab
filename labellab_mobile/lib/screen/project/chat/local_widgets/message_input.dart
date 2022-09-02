import 'dart:async';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mentions/flutter_mentions.dart';
import 'package:labellab_mobile/model/user.dart';

class MessageInput extends StatefulWidget {
  final TextEditingController controller;
  final Function onSubmit;
  List<User>? list;

  MessageInput(this.controller, this.onSubmit, {this.list});

  @override
  State<MessageInput> createState() => _MessageInputState();
}

class _MessageInputState extends State<MessageInput> {
  List<Map<String, dynamic>> mentiondata = [];

  bool isDataLoading = true;
  // String nonHashvalue = "";
  Timer? _debounce;
  GlobalKey<FlutterMentionsState> key = GlobalKey<FlutterMentionsState>();

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
              child: FlutterMentions(
                onEditingComplete: () {
                  widget.onSubmit; 
                },
                onMentionAdd: (Map<String, dynamic> map) {},
                decoration: InputDecoration(
                  border: InputBorder.none,
                  hintText: "Send a message",
                ),
                style: const TextStyle(fontSize: 16, color: Colors.black),
                onSearchChanged: (String trigger, String value) {
                  if (trigger == "@") {
                    if (_debounce?.isActive ?? false) _debounce!.cancel();
                    _debounce = Timer(const Duration(milliseconds: 200), () {
                      setState(() {
                        widget.list!.forEach((element) {
                          mentiondata.add({
                            "username": element.username,
                            "id": element.id,
                            "name": element.name,
                            "thumbnail": element.thumbnail,
                            "display": element.username ?? ""
                          });
                        });
                      });
                      print(mentiondata);
                    });
                  }
                },
                key: key,
                maxLines: 5,
                minLines: 1,
                suggestionPosition: SuggestionPosition.Top,
                mentions: [
                  Mention(
                      trigger: '@',
                      disableMarkup: false,
                      markupBuilder: ((trigger, mention, id) {
                        return "@[__${mention}__]";
                      }),
                      style: const TextStyle(color: Colors.blue),
                      data: mentiondata.reversed.toList(),
                      matchAll: true,
                      suggestionBuilder: (data) {
                        return Container(
                          padding: const EdgeInsets.all(10.0),
                          child: Row(
                            children: <Widget>[
                              CircleAvatar(
                                backgroundColor: Colors.black12,
                                radius: 25,
                                child: ClipOval(
                                  child: Image(
                                    width: 60,
                                    height: 60,
                                    image: CachedNetworkImageProvider(
                                        data['thumbnail']),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              const SizedBox(
                                width: 20.0,
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Text(data['name']),
                                  Text('@${data['username']}'),
                                ],
                              )
                            ],
                          ),
                        );
                      }),
                ],
              ),
            ),
          ),
          IconButton(
            onPressed: () {
              widget.onSubmit(widget.controller.text);
              widget.controller.clear();
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
