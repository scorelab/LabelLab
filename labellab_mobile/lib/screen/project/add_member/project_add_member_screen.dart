import 'package:flutter/material.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_bloc.dart';
import 'package:labellab_mobile/screen/project/add_member/project_add_member_state.dart';
import 'package:labellab_mobile/widgets/custom_dropdown.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';
import 'package:provider/provider.dart';

class ProjectAddMemberScreen extends StatefulWidget {
  _ProjectAddMemberScreenState createState() => _ProjectAddMemberScreenState();
}

class _ProjectAddMemberScreenState extends State<ProjectAddMemberScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _teamNameController = TextEditingController();
  final _roles = [
    'images',
    'labels',
    'models',
    'image labelling',
  ];
  String? _role;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Add member"),
        elevation: 0,
        centerTitle: true,
      ),
      body: StreamBuilder<ProjectAddMemberState>(
        stream: Provider.of<ProjectAddMemberBloc>(context).state,
        initialData: ProjectAddMemberState.initial(),
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            if (snapshot.data!.setSuccess) {
              WidgetsBinding.instance!
                  .addPostFrameCallback((_) => Application.router.pop(context));
            }
            final _state = snapshot.data!;
            return Stack(
              alignment: Alignment.bottomCenter,
              children: [
                Column(
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
                          LabelTextField(
                            labelText: "Team name",
                            controller: _teamNameController,
                          ),
                          SizedBox(height: 15),
                          Text(
                            'Team role',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 12,
                            ),
                          ),
                          CustomDropdown(
                            _roles,
                            _setRole,
                          ),
                          LabelTextField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            labelText: "Email",
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
                            children: _state.users!.map((user) {
                              return ListTile(
                                title: Text(user.name!),
                                subtitle: Text(user.email!),
                                onTap: () {
                                  _setMemberName(user.email!);
                                },
                              );
                            }).toList(),
                          )
                        : Container(),
                  ],
                ),
                Container(
                  margin: const EdgeInsets.all(10),
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      elevation: 0,
                      primary: Theme.of(context).accentColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: EdgeInsets.symmetric(vertical: 16.0),
                    ),
                    child: Text("Add Member"),
                    onPressed: _addProjectMember,
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

  void _addProjectMember() {
    String memberEmail = _emailController.text;
    String teamName = _teamNameController.text;
    if (memberEmail.isEmpty || teamName.isEmpty) {
      _showError('Please provide team name and email');
      return;
    }
    Provider.of<ProjectAddMemberBloc>(context, listen: false).addMember(
      memberEmail,
      teamName,
      _role!,
    );
  }

  void _searchUser(String email) {
    Provider.of<ProjectAddMemberBloc>(context, listen: false).searchUser(email);
  }

  void _setMemberName(String value) {
    setState(() {
      _emailController.text = value;
    });
  }

  void _setRole(String value) {
    _role = value;
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(message),
      backgroundColor: Colors.red,
    ));
  }
}
