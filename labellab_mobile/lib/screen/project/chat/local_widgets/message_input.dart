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
              child: Padding(
                padding: const EdgeInsets.only(left: 10),
                child: FlutterMentions(
                  suggestionListDecoration:
                      BoxDecoration(color: Colors.grey.shade300),
                  onEditingComplete: () {
                    widget.onSubmit(isDataLoading);
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
                          mentiondata = [];
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
                          return Padding(
                            padding: const EdgeInsets.only(left: 25, bottom: 5),
                            child: Container(
                                decoration: BoxDecoration(
                                  border: Border(
                                    bottom: BorderSide(
                                      color: Colors.grey,
                                    ),
                                  ),
                                ),
                                // padding: const EdgeInsets.all(10.0),
                                child: Row(
                                  children: <Widget>[
                                    Container(
                                      child: Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: CircleAvatar(
                                          backgroundColor: Colors.black12,
                                          radius: 20,
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
                                      ),
                                    ),
                                    const SizedBox(
                                      width: 10.0,
                                    ),
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Text(data['name']),
                                        Text('@${data['username']}'),
                                      ],
                                    )
                                  ],
                                )),
                          );
                        }),
                  ],
                ),
              ),
            ),
          ),
          IconButton(
            onPressed: () {
              widget.onSubmit(key.currentState!.controller!.text);
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
