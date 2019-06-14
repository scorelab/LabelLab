import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/project/project_bloc.dart';
import 'package:labellab_mobile/screen/project/project_item.dart';
import 'package:labellab_mobile/screen/project/project_state.dart';
import 'package:provider/provider.dart';

class ProjectScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Projects"),
        centerTitle: true,
        elevation: 2,
      ),
      body: StreamBuilder(
        stream: Provider.of<ProjectBloc>(context).projects,
        builder: (context, AsyncSnapshot<ProjectState> snapshot) {
          if (snapshot.hasData) {
            final ProjectState state = snapshot.data;
            return RefreshIndicator(
              onRefresh: () async {
                Provider.of<ProjectBloc>(context).refresh();
              },
              child: ListView(
                children: <Widget>[
                  state.isLoading
                      ? LinearProgressIndicator(
                          backgroundColor: Theme.of(context).canvasColor,
                        )
                      : Container(
                          height: 6,
                        ),
                  state.error != null
                      ? ListTile(
                          title: Text(state.error),
                        )
                      : Container(),
                  state.projects != null
                      ? Column(
                          children: state.projects
                              .map((project) => ProjectItem(project))
                              .toList(),
                        )
                      : Container(),
                ],
              ),
            );
          } else {
            return Text("No data");
          }
        },
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () {
          
        },
      ),
    );
  }
}
