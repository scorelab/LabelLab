import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/issue/issue_bloc.dart';
import 'package:labellab_mobile/widgets/issue_list_tile.dart';
import 'package:provider/provider.dart';

import '../../widgets/empty_placeholder.dart';
import 'issue_state.dart';

class IssueActivity extends StatelessWidget {
  final bool entitySpecific;
  final bool categorySpecific;

  IssueActivity({
    this.entitySpecific = false,
    this.categorySpecific = false,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: Text('All Issues',style: TextStyle(color: Colors.black)),
        centerTitle: true,
        elevation: 0,
        actions: [
          (entitySpecific || categorySpecific)
              ? Container()
              : 
              IconButton(
                  onPressed: () {},
                  icon: Icon(Icons.settings,color: Colors.black,),
                )
        ],
      ),
      body: StreamBuilder<IssueState>(
        initialData: IssueState.loading(),
        stream: Provider.of<IssueBloc>(context).issues,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting ||
              !snapshot.hasData) {
            return _loadingIndicator(context);
          }
          final _state = snapshot.data;
          return RefreshIndicator(
            onRefresh: () async {
              Provider.of<IssueBloc>(context).refresh();
            },
            child: _state!.isLoading
                ? _loadingIndicator(context)
                : _state.issues!.isEmpty
                    ? EmptyPlaceholder(description: 'No issues available')
                    : Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: ListView.builder(
                          itemBuilder: (ctx, index) => IssueListTile(
                            _state.issues![index],
                            isCustomized: true,
                          ),
                          itemCount: _state.issues!.length,
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

  // void _openFiltersBottomSheet(BuildContext context) {
  //   String projectId =
  //       Provider.of<ProjectActivityBloc>(context, listen: false).projectId;
  //   showModalBottomSheet(
  //     backgroundColor: Colors.transparent,
  //     context: context,
  //     builder: (ctx) => Provider<ProjectDetailBloc>(
  //       create: (context) => ProjectDetailBloc(projectId),
  //       dispose: (context, bloc) => bloc.dispose(),
  //       child: FilterBottomSheet(),
  //     ),
  //   ).then((logs) {
  //     if (logs != null) {
  //       Provider.of<ProjectActivityBloc>(context, listen: false).setLogs(logs);
  //     }
  //   });
  // }
}
