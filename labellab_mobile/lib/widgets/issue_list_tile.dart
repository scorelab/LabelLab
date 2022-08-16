import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/mapper/issue_mapper.dart';
import 'package:labellab_mobile/model/issue.dart';

class IssueListTile extends StatelessWidget {
  final Issue issue;
  final bool isCustomized;
  final VoidCallback? onItemTapped;

  IssueListTile(this.issue, {this.onItemTapped, this.isCustomized = false});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: this.onItemTapped,
      child: Card(
        elevation: 2,
        child: Padding(
          padding: const EdgeInsets.only(top: 1,bottom: 10),
          child: Container(
            height: 80,
            child: Row(
               
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(6.0),
                    child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                            flex: 4,
                            child: Row(
                              children: [
                                Text("#" + issue.id!.toString() + " ",
                                    style: TextStyle(
                                        fontSize: 20, color: Colors.grey)),
                                Text(issue.issueTitle!,
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    )),
                              ],
                            )),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            coloredBox(
                                context,
                                IssueMapper.statusToString(issue.issueStatus),
                                Icons.replay_circle_filled_rounded,
                                Colors.teal,
                                Colors.teal),
                            coloredBox(
                                context,
                                IssueMapper.categoryToString(issue.issueCategory),
                                _getIcon(IssueMapper.categoryToString(
                                    issue.issueCategory)),
                                _getTextOrBorderColor(
                                    IssueMapper.categoryToString(
                                        issue.issueCategory)),
                                _getTextOrBorderColor(
                                    IssueMapper.categoryToString(
                                        issue.issueCategory))),
                            coloredBox(
                                context,
                                IssueMapper.priorityToString(issue.issuePriority),
                                Icons.show_chart,
                                _getPriorityTextColor(
                                    IssueMapper.priorityToString(
                                        issue.issuePriority)),
                                _getPriorityBackgroundColor(
                                    IssueMapper.priorityToString(
                                        issue.issuePriority))),
                          ],
                        )
                      ],
                    ),
                  ),
                  flex: 14,
                ),
                SizedBox(height: 10,)
              ],
            ),
          ),
        ),
      ),
    );
  }

  Color _getPriorityBackgroundColor(String priority) {
    switch (priority) {
      case 'Low':
        return Colors.purple.withOpacity(0.3);
      case 'Medium':
        return Color(0xff0C7800).withOpacity(0.3);
      case 'Critical':
        return Color(0xff980000).withOpacity(0.3);
      case 'High':
        return Colors.orange.withOpacity(0.3);
      default:
        return Colors.black.withOpacity(0.3);
    }
  }

  Color _getTextOrBorderColor(String category) {
    switch (category) {
      case 'General':
        return Color(0xff3A35C4);
      case 'Images':
        return Color(0xff0C7800);
      case 'Labels':
        return Color(0xff980000);
      case 'Models':
        return Color(0xffCBBD00);
      case 'Labelling':
        return Color(0xfff26d5b);
      default:
        return Colors.black;
    }
  }

  IconData _getIcon(String role) {
    switch (role) {
      case 'Images':
        return Icons.image;
      case 'Labels':
        return Icons.label;
      case 'Labelling':
        return Icons.image_search_rounded;
      case 'Models':
        return Icons.model_training;
      default:
        return Icons.people;
    }
  }

  Color _getPriorityTextColor(String priority) {
    switch (priority) {
      case 'Low':
        return Colors.purple;
      case 'Medium':
        return Color(0xff0C7800);
      case 'Critical':
        return Color(0xff980000);
      case 'High':
        return Colors.orange;
      default:
        return Colors.black;
    }
  }

  Widget coloredBox(BuildContext context, String text, IconData icon,
      Color textColor, Color backgroundColor) {
    final size = MediaQuery.of(context).size;
    return Container(
        height: 30,
        width: isCustomized ? size.width * 0.3 : size.width * 0.28,
        decoration: BoxDecoration(
          color: isCustomized
              ? backgroundColor.withOpacity(0.3)
              : Colors.teal.withOpacity(0.3),
          border: Border.all(
            width: 1,
            color: isCustomized ? backgroundColor : Colors.teal,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.only(left: 4),
          child: Row(
            children: [
              Icon(
                icon,
                size: 20,
                color: isCustomized ? textColor : Colors.teal,
              ),
              SizedBox(
                width: 4,
              ),
              Text(
                text,
                style: TextStyle(color: isCustomized ? textColor : Colors.teal),
              )
            ],
          ),
        ));
  }
}