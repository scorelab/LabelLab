import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/project/project_activity/local_widgets/filter_bottom_sheet.dart';
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
        actions: [
          IconButton(
            onPressed: () => _openFiltersBottomSheet(context),
            icon: Icon(Icons.settings),
          )
        ],
      ),
      body: StreamBuilder<ProjectActivityState>(
        initialData: ProjectActivityState.loading(),
        stream: Provider.of<ProjectActivityBloc>(context).state,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting ||
              !snapshot.hasData) {
            return _loadingIndicator(context);
          }
          final _state = snapshot.data;
          return RefreshIndicator(
            onRefresh: () async {
              Provider.of<ProjectActivityBloc>(context).refresh();
            },
            child: _state!.isLoading
                ? _loadingIndicator(context)
                : Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: ListView.builder(
                      itemBuilder: (ctx, index) => RecentActivityListTile(
                        _state.logs![index],
                        isCustomized: true,
                      ),
                      itemCount: _state.logs!.length,
                    ),
                  ),
          );
        },
      ),
    );
  }

  Widget _loadingIndicator(BuildContext context) {
    return LinearProgressIndicator(
      backgroundColor: Theme.of(context).canvasColor,
    );
  }

  void _openFiltersBottomSheet(BuildContext context) {
    showModalBottomSheet(
      backgroundColor: Colors.transparent,
      context: context,
      builder: (ctx) => FilterBottomSheet(),
    );
  }
}
