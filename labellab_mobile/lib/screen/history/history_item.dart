import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/classification.dart';

class HistoryItem extends StatelessWidget {
  final Classification classification;
  final VoidCallback onSelected;
  final VoidCallback onDeleteSelected;

  const HistoryItem(this.classification,
      {Key key, this.onSelected, this.onDeleteSelected})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      child: Card(
        margin: EdgeInsets.all(8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            ClipRRect(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(8),
                topRight: Radius.circular(8),
              ),
              child: Image(
                height: 240,
                image: CachedNetworkImageProvider(classification.imageUrl),
                fit: BoxFit.cover,
              ),
            ),
            ListTile(
              title: Row(
                children: classification.label != null
                    ? classification.label
                        .map((label) => Chip(
                              label: Text(label.labelName),
                            ))
                        .toList()
                    : [],
              ),
              trailing: PopupMenuButton<int>(
                onSelected: (int selected) {
                  switch (selected) {
                    case 0:
                      if (onDeleteSelected != null) onDeleteSelected();
                      break;
                  }
                },
                itemBuilder: (context) {
                  return [
                    PopupMenuItem(
                      value: 0,
                      child: Text("Delete"),
                    )
                  ];
                },
              ),
            ),
          ],
        ),
      ),
      onTap: this.onSelected,
    );
  }
}
