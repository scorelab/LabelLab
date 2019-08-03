import 'package:flutter/material.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_bloc.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_state.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';
import 'package:provider/provider.dart';

class ProjectAddMemberScreen extends StatefulWidget {
  ProjectAddMemberScreen({Key key}) : super(key: key);

  _ProjectAddMemberScreenState createState() => _ProjectAddMemberScreenState();
}

class _ProjectAddMemberScreenState extends State<ProjectAddMemberScreen> {
  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Add member"),
        elevation: 2,
      ),
      body: StreamBuilder<ProjectAddMemberState>(
        stream: Provider.of<ProjectAddMemberBloc>(context).state,
        initialData: ProjectAddMemberState.initial(),
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            if (snapshot.data.setSuccess) {
              WidgetsBinding.instance
                  .addPostFrameCallback((_) => Application.router.pop(context));
            }
            final _state = snapshot.data;
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      LabelTextField(
                        controller: _controller,
                        keyboardType: TextInputType.emailAddress,
                        labelText: "Email",
                        onSubmit: _searchUser,
                      ),
                      SizedBox(height: 8),
                      RaisedButton(
                        elevation: 0,
                        color: Theme.of(context).accentColor,
                        colorBrightness: Brightness.dark,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: EdgeInsets.symmetric(vertical: 16.0),
                        child: _state.isLoading
                            ? Text("Searching...")
                            : Text("Search"),
                        onPressed: _state.isLoading
                            ? null
                            : () => _searchUser(_controller.text),
                      ),
                    ],
                  ),
                ),
                _state.user != null
                    ? Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16.0),
                            child: Text(
                              "Results",
                              style: Theme.of(context).textTheme.subtitle,
                            ),
                          ),
                          ListTile(
                            title: Text(_state.user.name),
                            subtitle: Text(_state.user.email),
                            onTap: () {
                              Provider.of<ProjectAddMemberBloc>(context)
                                  .addMember(_state.user.email);
                            },
                          ),
                        ],
                      )
                    : Container(),
              ],
            );
          } else {
            return Container();
          }
        },
      ),
    );
  }

  void _searchUser(String email) {
    Provider.of<ProjectAddMemberBloc>(context).searchUser(email);
  }
}
