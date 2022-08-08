import 'dart:io';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/issue.dart';
import 'package:labellab_mobile/model/mapper/issue_mapper.dart';

class ExpandableText extends StatefulWidget {
  const ExpandableText({Key? key, required this.issue}) : super(key: key);

  final Issue issue;

  @override
  ExpandableTextState createState() => ExpandableTextState();
}

class ExpandableTextState extends State<ExpandableText>
    with TickerProviderStateMixin {
  bool expanded = false;
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      expanded
          ? AnimatedSize(
              duration: const Duration(milliseconds: 250),
              child: ConstrainedBox(
                constraints: expanded
                    ? const BoxConstraints()
                    : const BoxConstraints(maxHeight: 85),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(
                          "Category:",
                          style: TextStyle(color: Colors.grey, fontSize: 15),
                        ),
                        SizedBox(
                          width: size.width / 40,
                        ),
                        Text(
                          IssueMapper.categoryToString(widget.issue.issueCategory),
                          style: Theme.of(context).textTheme.headline6,
                        ),
                        SizedBox(
                          width: size.width / 3,
                        ),
                        Text(
                          "Team:",
                          style: TextStyle(color: Colors.grey, fontSize: 15),
                        ),
                        Text(
                          widget.issue.team_id.toString(),
                          style: Theme.of(context).textTheme.headline6,
                        ),
                      ],
                    ),
                    SizedBox(
                      height: size.height / 30,
                    ),
                    Text(
                      "Created at",
                      style: TextStyle(color: Colors.grey, fontSize: 15),
                    ),
                    ListTile(
                      leading: Icon(
                        Icons.calendar_month_sharp,
                        color: Colors.teal,
                      ),
                      title: Text(widget.issue.created_At.toString()),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Text(
                      "Updated at",
                      style: TextStyle(color: Colors.grey, fontSize: 15),
                    ),
                    ListTile(
                      leading: Icon(
                        Icons.calendar_month_sharp,
                        color: Colors.teal,
                      ),
                      title: Text(widget.issue.updated_At.toString()),
                    ),
                                        SizedBox(
                      height: 10,
                    ),
                    Text(
                      "Associtated Entities",
                      style: TextStyle(color: Colors.grey, fontSize: 15),
                    ),
                    ListTile(
                      title: Text(widget.issue.entityType ==null ? "General " :widget.issue.entityType.toString() + " : " + widget.issue.entityId.toString()),
                    )
                  ],
                ),
              ),
            )
          : Container(),
      expanded
          ? InkWell(
              onTap: () => setState(
                () => expanded = false,
              ),
              child: Text('Less', style: TextStyle(color: Color.fromARGB(255, 24, 138, 191))),
            )
          : InkWell(
              onTap: () => setState(
                () => expanded = true,
              ),
              child: Text('More', style: TextStyle(color: Color.fromARGB(255, 24, 138, 191))),
            )
    ]);
  }
}

// onPressed: () => setState(() => expanded = false
