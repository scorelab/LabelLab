import 'package:flutter/material.dart';

import '../model/issue.dart';
import '../model/mapper/issue_mapper.dart';

class IssueListTile extends StatelessWidget {
  final Issue issue;
  final bool isCustomized;
  final VoidCallback? onItemTapped;

  IssueListTile(this.issue, {this.onItemTapped, this.isCustomized = false});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return InkWell(
      onTap: this.onItemTapped,
      child: Container(
        padding: EdgeInsets.symmetric(
          vertical: isCustomized ? 12 : 10,
          horizontal: 10,
        ),
        margin: EdgeInsets.only(bottom: isCustomized ? 7.5 : 5),
        decoration: BoxDecoration(
          color: isCustomized
              ? _getBackgroundColor(
                  IssueMapper.priorityToString(issue.issuePriority))
              : Color(0xff01A8A0).withOpacity(0.2),
          border: Border.all(
            width: 1,
            color: isCustomized
                ? _getPriorityTextColor(
                    IssueMapper.priorityToString(issue.issuePriority))
                : Color(0xff01A8A0),
          ),
          borderRadius: BorderRadius.circular(5),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Issue #" + issue.id!.toString(),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  issue.issueTitle!,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),

            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        children: [
                          Container(
                            height: size.height/30,
                            width: size.width/8,
                            decoration: BoxDecoration(
                            color:
                                 _getStatusTextColor(
                                    IssueMapper.statusToString(
                                        issue.issueStatus)),
                                        borderRadius: BorderRadius.circular(20)
                            ),

                                // : Color(0xff01A8A0),
                            child: Center(
                              child: Text(
                                  IssueMapper.statusToString(issue.issueStatus)),
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(
                      width: size.width / 4,
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Text("Issue #" +issue.id!.toString()),
                        Text(
                          "Priority: " +
                              IssueMapper.priorityToString(issue.issuePriority),
                          style: TextStyle(
                            fontSize: 12,
                            color: isCustomized
                                ? _getPriorityTextColor(
                                    IssueMapper.priorityToString(
                                        issue.issuePriority))
                                : Color(0xff01A8A0),
                          ),
                        ),
                        Text(
                          "Category: " +
                              IssueMapper.categoryToString(issue.issueCategory),
                          style: TextStyle(
                            fontSize: 12,
                            color: isCustomized
                                ? _getTextOrBorderColor(
                                    IssueMapper.categoryToString(
                                        issue.issueCategory))
                                : Color(0xff01A8A0),
                          ),
                        )
                      ],
                    )
                  ],
                ),
              ],
            ),
            // Divider(
            //   height: 5,
            //   color: Colors.black,
            // ),
            // Row(
            //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
            //   children: [
            //     Text("Posted by: " + issue.created_by.toString(),
            //         style: TextStyle(
            //           fontSize: 12,
            //         )),
            //     Text("Comments " + 0.toString(),
            //         style: TextStyle(
            //           fontSize: 12,
            //         )),
            //   ],
            // )
          ],
        ),
      ),
    );
  }

  Color _getBackgroundColor(String category) {
    switch (category) {
      case 'Low':
        return Colors.grey.withOpacity(0.3);
      case 'Medium':
        return Color(0xff0C7800).withOpacity(0.3);
      case 'Critical':
        return Color(0xff980000).withOpacity(0.3);
      case 'High':
        return Color(0xffCBBD00).withOpacity(0.3);
      default:
        return Colors.black.withOpacity(0.3);
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

  Color _getStatusTextColor(String category) {
    switch (category) {
      case 'Review':
        return Color(0xff3A35C4);
      case 'Done':
        return Color(0xff0C7800);
      case 'Closed':
        return Color(0xff980000);
      case 'In Progress':
        return Color(0xffCBBD00);
      case 'Open':
        return Color(0xfff26d5b);
      default:
        return Colors.black;
    }
  }

  Color _getPriorityTextColor(String category) {
    switch (category) {
      case 'Low':
        return Colors.grey;
      case 'Medium':
        return Color(0xff0C7800);
      case 'Critical':
        return Color(0xff980000);
      case 'High':
        return Color(0xffCBBD00);
      default:
        return Colors.black;
    }
  }
}
