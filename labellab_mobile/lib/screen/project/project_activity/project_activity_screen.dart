import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/log.dart';
import 'package:labellab_mobile/screen/project/project_activity/project_activity_bloc.dart';
import 'package:labellab_mobile/screen/project/project_activity/project_activity_state.dart';
import 'package:labellab_mobile/widgets/recent_activity_list_tile.dart';
import 'package:provider/provider.dart';

class ProjectActivityScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Project Activity'),
        centerTitle: true,
        elevation: 0,
      ),
      body: StreamBuilder<ProjectActivityState>(
        initialData: ProjectActivityState.loading(),
        stream: Provider.of<ProjectActivityBloc>(context).state,
        builder: (context, snapshot) {
          final _state = snapshot.data;
          final List<Log> _logs = _state!.logs!;
          return Padding(
            padding: const EdgeInsets.all(8.0),
            child: ListView.builder(
              itemBuilder: (ctx, index) => RecentActivityListTile(_logs[index]),
              itemCount: _logs.length,
            ),
          );
        },
      ),
    );
  }
}
