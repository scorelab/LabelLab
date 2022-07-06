import 'package:flutter/material.dart';

import '../model/issue.dart';
import '../model/mapper/issue_mapper.dart';


class IssueListTile extends StatelessWidget {
  final Issue issue;
  final bool isCustomized;

  IssueListTile(this.issue, {this.isCustomized = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        vertical: isCustomized ? 10 : 7.5,
        horizontal: 10,
      ),
      margin: EdgeInsets.only(bottom: isCustomized ? 7.5 : 5),
      decoration: BoxDecoration(
        color: isCustomized
            ? _getBackgroundColor(IssueMapper.categoryToString(issue.issueCategory))
            : Color(0xff01A8A0).withOpacity(0.2),
        border: Border.all(
          width: 1, 
          color: isCustomized
              ? _getTextOrBorderColor(IssueMapper.categoryToString(issue.issueCategory))
              : Color(0xff01A8A0),
        ),
        borderRadius: BorderRadius.circular(5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            issue.issueTitle!,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: isCustomized
                  ? _getTextOrBorderColor(IssueMapper.categoryToString(issue.issueCategory))
                  : Color(0xff01A8A0),
            ),
          ),
          SizedBox(height: 5),
          // Icon(Icons.)
          Row(
            children: [
              Text(
                IssueMapper.categoryToString(issue.issueCategory),
                style: TextStyle(
                  fontSize: 12,
                  color: isCustomized
                      ? _getTextOrBorderColor(IssueMapper.categoryToString(issue.issueCategory))
                      : Color(0xff01A8A0),
                ),
              ),
              Text(
                "assigened to" ,
                style: TextStyle(
                  fontSize: 12,
                  color: isCustomized
                      ? _getTextOrBorderColor(IssueMapper.categoryToString(issue.issueCategory))
                      : Color(0xff01A8A0),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Color _getBackgroundColor(String category) {
    switch (category) {
      case 'general':
        return Color(0xff3A35C4).withOpacity(0.3);
      case 'images':
        return Color(0xff0C7800).withOpacity(0.3);
      case 'labels':
        return Color(0xff980000).withOpacity(0.3);
      case 'models':
        return Color(0xffCBBD00).withOpacity(0.3);
      case 'image labelling':
        return Color(0xfff26d5b).withOpacity(0.3);
      default:
        return Colors.black.withOpacity(0.2);
    }
  }

  Color _getTextOrBorderColor(String category) {
    switch (category) {
      case 'general':
        return Color(0xff3A35C4);
      case 'images':
        return Color(0xff0C7800);
      case 'labels':
        return Color(0xff980000);
      case 'models':
        return Color(0xffCBBD00);
      case 'image labelling':
        return Color(0xfff26d5b);
      default:
        return Colors.black;
    }
  }
}
