import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/group.dart';

class GroupItem extends StatelessWidget {
  final Group group;

  GroupItem(this.group);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Row(
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Container(
                width: 64,
                height: 64,
                child: GridView.count(
                  shrinkWrap: false,
                  crossAxisCount: 2,
                  children: group.images!
                      .take(4)
                      .map((image) => Container(
                            decoration: BoxDecoration(
                                image: DecorationImage(
                                    image: CachedNetworkImageProvider(
                                        image.imageUrl!),
                                    fit: BoxFit.cover)),
                          ))
                      .toList(),
                ),
              ),
            ),
          ),
          SizedBox(width: 8),
          Center(child: Text(group.name!)),
          SizedBox(width: 8),
        ],
      ),
    );
  }
}
