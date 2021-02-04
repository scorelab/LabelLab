import 'package:flutter/material.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_bloc.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_state.dart';
import 'package:labellab_mobile/widgets/label_dropdown.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';
import 'package:provider/provider.dart';

class ProjectAddMemberScreen extends StatefulWidget {
  ProjectAddMemberScreen({Key key}) : super(key: key);

  _ProjectAddMemberScreenState createState() => _ProjectAddMemberScreenState();
}

class _ProjectAddMemberScreenState extends State<ProjectAddMemberScreen> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();

  List<String> _roles = ['labels', 'images', 'image labelling', 'models'];
  String _role;
  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      resizeToAvoidBottomPadding: false,
      appBar: AppBar(
        title: Text("Add member"),
        elevation: 0,
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
            return Stack(
              alignment: Alignment.bottomCenter,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    _state.isLoading
                        ? LinearProgressIndicator()
                        : Container(
                            height: 6,
                          ),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: <Widget>[
                          (_state.error != null && _state.error.isNotEmpty)
                              ? Text(
                                  _state.error,
                                  style: TextStyle(color: Colors.red),
                                )
                              : Container(),
                          LabelDropdown(
                            value: _role,
                            label: 'Role of Member',
                            items: _roles,
                            onChange: _onRoleChange,
                          ),
                          LabelTextField(
                            controller: _controller,
                            keyboardType: TextInputType.emailAddress,
                            labelText: "Email",
                            onSubmit: _searchUser,
                            onChange: _searchUser,
                          ),
                          SizedBox(height: 8),
                        ],
                      ),
                    ),
                    _state.users != null
                        ? Padding(
                            padding:
                                const EdgeInsets.symmetric(horizontal: 16.0),
                            child: Text(
                              "Results",
                              style: Theme.of(context).textTheme.subtitle2,
                            ),
                          )
                        : Container(),
                    _state.users != null
                        ? Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: _state.users.map((user) {
                              return ListTile(
                                title: Text(user.name),
                                subtitle: Text(user.email),
                                onTap: () {
                                  setState(() {
                                    _controller.text = user.email;
                                  });
                                },
                              );
                            }).toList(),
                          )
                        : Container(),
                  ],
                ),
                Container(
                  width: MediaQuery.of(context).size.width,
                  padding: const EdgeInsets.all(15),
                  child: RaisedButton(
                    elevation: 0,
                    color: Theme.of(context).accentColor,
                    colorBrightness: Brightness.dark,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: EdgeInsets.symmetric(vertical: 16.0),
                    child: Text("Add Project Member"),
                    onPressed: _addProjectMemberHandler,
                  ),
                ),
              ],
            );
          } else {
            return Container();
          }
        },
      ),
    );
  }

  void _addProjectMemberHandler() {
    if (_role == null) {
      _showError('Please select a role');
      return;
    }
    if (_controller.text.isEmpty) {
      _showError('Please select an email');
      return;
    }
    Provider.of<ProjectAddMemberBloc>(context)
        .addMember(_controller.text, _role);
  }

  void _searchUser(String email) {
    Provider.of<ProjectAddMemberBloc>(context).searchUser(email);
  }

  void _onRoleChange(String value) {
    setState(() => _role = value);
    print(_role);
  }

  void _showError(String message) {
    _scaffoldKey.currentState.showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.redAccent,
      ),
    );
  }
}
