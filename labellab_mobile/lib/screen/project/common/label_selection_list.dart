import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/label_selection.dart';

typedef void OnDeleteSelection(LabelSelection selection);

class LabelSelectionList extends StatelessWidget {
  final List<LabelSelection> selections;
  final bool isEditable;
  final OnDeleteSelection onDeleted;

  LabelSelectionList(this.selections, this.isEditable, {this.onDeleted});

  @override
  Widget build(BuildContext context) {
    if (selections.length > 0) {
      return Container(
        alignment: Alignment.centerLeft,
        height: 54,
        padding: EdgeInsets.only(right: 8),
        child: ListView(
          scrollDirection: Axis.horizontal,
          children: selections.map((selection) {
            return Padding(
              padding: const EdgeInsets.only(left: 8.0),
              child: Chip(
                label: Text(selection.label.name),
                backgroundColor: selection.color,
                deleteIcon: isEditable ? Icon(Icons.cancel) : null,
                onDeleted: isEditable
                    ? () {
                        if (onDeleted != null) {
                          onDeleted(selection);
                        }
                      }
                    : null,
              ),
            );
          }).toList(),
        ),
      );
    } else {
      return Container(
        height: 54,
      );
    }
  }
}
