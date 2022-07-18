import 'package:flutter/material.dart';
import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:labellab_mobile/model/issue.dart';
import 'package:labellab_mobile/screen/issue/details/issue_details_bloc.dart';
import 'package:labellab_mobile/screen/issue/details/issue_details_state.dart';
import 'package:provider/provider.dart';

class IssueDetailScreen extends StatelessWidget {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<IssueDetailState>(
      stream: Provider.of<IssueDetailBloc>(context).state,
      initialData: IssueDetailState.loading(),
      builder: (context, snapshot) {
        IssueDetailState _state = snapshot.data!;
        return Scaffold(
          key: _scaffoldKey,
          body: CustomScrollView(
            slivers: <Widget>[
              SliverAppBar(
                backgroundColor: Theme.of(context).accentColor,
                iconTheme: IconThemeData(color: Colors.white),
                actionsIconTheme: IconThemeData(color: Colors.white),
                expandedHeight: 200,
                elevation: 2,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  background: Container(),
                  centerTitle: true,
                  title: Text(
                    "issue 1",
                    // _state.issue != null ? _state.issue!.issueTitle! : "",
                    style: TextStyle(color: Colors.white),
                    textAlign: TextAlign.center,
                  ),
                ),
                actions: [Icon(Icons.abc)],
              )
            ],
          ), //error here
        );
      },
    );
  }
}
