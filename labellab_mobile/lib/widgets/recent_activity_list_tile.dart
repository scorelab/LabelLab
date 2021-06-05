import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/log.dart';

class RecentActivityListTile extends StatelessWidget {
  final Log log;

  RecentActivityListTile(this.log);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        vertical: 7.5,
        horizontal: 10,
      ),
      margin: const EdgeInsets.only(bottom: 5),
      decoration: BoxDecoration(
        color: Color(0xff01A8A0).withOpacity(0.2),
        border: Border.all(
          width: 1,
          color: Color(0xff01A8A0),
        ),
        borderRadius: BorderRadius.circular(5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            log.message!,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Color(0xff01A8A0),
            ),
          ),
          SizedBox(height: 5),
          Row(
            children: [
              Text(
                log.timestamp!,
                style: TextStyle(
                  fontSize: 12,
                  color: Color(0xff01A8A0),
                ),
              ),
              Text(
                "  (by ${log.username!})",
                style: TextStyle(
                  fontSize: 12,
                  color: Color(0xff01A8A0),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
