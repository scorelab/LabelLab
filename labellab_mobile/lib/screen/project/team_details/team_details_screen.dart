import 'dart:math';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/log.dart';
import 'package:labellab_mobile/model/team.dart';
import 'package:labellab_mobile/model/team_member.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/project/add_team_dialog/add_team_dialog.dart';
import 'package:labellab_mobile/screen/project/team_details/local_widgets/add_team_member_dialog.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:labellab_mobile/widgets/delete_confirm_dialog.dart';
import 'package:labellab_mobile/widgets/empty_placeholder.dart';
import 'package:labellab_mobile/widgets/recent_activity_list_tile.dart';
import 'package:provider/provider.dart';
import 'package:labellab_mobile/screen/project/team_details/team_details_bloc.dart';
import 'package:labellab_mobile/screen/project/team_details/team_details_state.dart';

class TeamDetailsScreen extends StatelessWidget {
  const TeamDetailsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Team Details'),
        centerTitle: true,
        elevation: 0,
        actions: [
          PopupMenuButton<int>(
            onSelected: (int value) {
              if (value == 0) {
                _showEditTeamDialog(context);
              }
            },
            itemBuilder: (context) {
              return [
                PopupMenuItem(
                  value: 0,
                  child: Text("Edit"),
                ),
                PopupMenuItem(
                  value: 1,
                  child: Text("Delete"),
                ),
              ];
            },
          ),
        ],
      ),
      body: StreamBuilder<TeamDetailsState>(
        stream: Provider.of<TeamDetailsBloc>(context).state,
        initialData: TeamDetailsState.loading(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting ||
              !snapshot.hasData) {
            return _loadingIndicator(context);
          }
          final _state = snapshot.data;
          return RefreshIndicator(
            onRefresh: () async {
              Provider.of<TeamDetailsBloc>(context).refresh();
            },
            child: _state!.isLoading
                ? _loadingIndicator(context)
                : Provider.of<TeamDetailsBloc>(context).hasTeamAccess()
                    ? SingleChildScrollView(
                        padding: const EdgeInsets.all(10),
                        child: Column(
                          children: [
                            _getTeamOverview(context, _state.team!),
                            _getButton(
                              context,
                              'View Activity Log',
                              () => _goToTeamLogs(context,
                                  _state.team!.projectId!, _state.team!.role!),
                            ),
                            _getButton(
                                context,
                                'View Chatroom',
                                () => _goToTeamChatroom(
                                    context, _state.team!.id!)),
                            _recentTeamActivity(context, _state.team!.logs!),
                            _buildMembers(context, _state.team!.members!),
                          ],
                        ),
                      )
                    : EmptyPlaceholder(
                        description:
                            'You have to be a team member to access this screen',
                      ),
          );
        },
      ),
    );
  }

  Widget _getTeamOverview(BuildContext context, Team team) {
    return Container(
      padding: const EdgeInsets.all(15),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(15),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Theme.of(context).accentColor,
                width: 0.6,
              ),
              color: Theme.of(context).accentColor.withOpacity(0.3),
            ),
            child: Icon(
              _getIcon(team.role!),
              size: 60,
              color: Theme.of(context).accentColor,
            ),
          ),
          SizedBox(width: 20),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                team.name!,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 5),
              Container(
                padding: const EdgeInsets.all(5),
                decoration: BoxDecoration(
                  border: Border.all(
                    color: Theme.of(context).accentColor,
                    width: 0.6,
                  ),
                  borderRadius: BorderRadius.circular(15),
                  color: Theme.of(context).accentColor.withOpacity(0.3),
                ),
                child: Text(
                  team.role!,
                  style: TextStyle(
                    color: Theme.of(context).accentColor,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _recentTeamActivity(BuildContext context, List<Log> logs) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Recent Activity',
            style: Theme.of(context).textTheme.headline6,
          ),
          SizedBox(height: 10),
          logs.isNotEmpty
              ? Container(
                  height: min(170, logs.length * 57),
                  child: ListView(
                    padding: const EdgeInsets.all(0),
                    children: [
                      for (var log in logs) RecentActivityListTile(log)
                    ],
                  ),
                )
              : _buildEmptyPlaceholder(context, "No activity yet"),
        ],
      ),
    );
  }

  Widget _buildEmptyPlaceholder(BuildContext context, String description) {
    return Row(
      children: <Widget>[
        Icon(
          Icons.error,
          size: 28,
          color: Colors.black45,
        ),
        SizedBox(
          width: 8,
        ),
        Text(
          description,
          style: TextStyle(color: Colors.black45),
        ),
      ],
    );
  }

  Widget _buildMembers(BuildContext context, List<TeamMember> members) {
    final _currentUser = Provider.of<AuthState>(context, listen: false).user;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Members',
            style: Theme.of(context).textTheme.headline6,
          ),
          Provider.of<TeamDetailsBloc>(context, listen: false).isAdmin()
              ? TextButton.icon(
                  icon: Icon(Icons.add),
                  label: Text("Add"),
                  onPressed: () => _showAddMemberConfirmation(context),
                )
              : Container()
        ],
      ),
      for (var member in members)
        ListTile(
          title: Text(member.name!),
          subtitle: Text(member.email!),
          trailing:
              (Provider.of<TeamDetailsBloc>(context, listen: false).isAdmin() &&
                      _currentUser!.email != member.email)
                  ? PopupMenuButton<int>(
                      onSelected: (value) {
                        if (value == 0) {
                          _showRemoveMemberConfirmation(context, member.email!);
                        }
                      },
                      itemBuilder: (context) {
                        return [
                          PopupMenuItem(
                            value: 0,
                            child: Text("Remove"),
                          ),
                        ];
                      },
                    )
                  : null,
        )
    ]);
  }

  Widget _getButton(BuildContext context, String text, Function onPressed) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 7.5),
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
        child: Text(text),
        onPressed: () => onPressed(),
      ),
    );
  }

  Widget _loadingIndicator(BuildContext context) {
    return LinearProgressIndicator(
      backgroundColor: Theme.of(context).canvasColor,
    );
  }

  IconData _getIcon(String role) {
    switch (role) {
      case 'images':
        return Icons.image;
      case 'labels':
        return Icons.label;
      case 'image labelling':
        return Icons.image_search_rounded;
      case 'models':
        return Icons.model_training;
      case 'admin':
        return Icons.people_alt;
      default:
        return Icons.people;
    }
  }

  void _showAddMemberConfirmation(BuildContext baseContext) {
    showDialog<bool>(
      context: baseContext,
      builder: (context) {
        return AddTeamMemberDialog(
          onCancel: () => Navigator.pop(baseContext),
          onConfirm: (email) {
            Provider.of<TeamDetailsBloc>(baseContext, listen: false)
                .addTeamMember(email);
            Navigator.of(baseContext).pop(true);
          },
        );
      },
    );
  }

  void _showRemoveMemberConfirmation(
      BuildContext baseContext, String memberEmail) {
    showDialog<bool>(
      context: baseContext,
      builder: (context) {
        return DeleteConfirmDialog(
          name: 'member',
          onCancel: () => Navigator.pop(context),
          onConfirm: () {
            Provider.of<TeamDetailsBloc>(baseContext, listen: false)
                .removeTeamMember(memberEmail);
            Navigator.of(context).pop(true);
          },
        );
      },
    );
  }

  void _goToTeamChatroom(BuildContext context, String teamId) {
    String userId = Provider.of<AuthState>(context, listen: false).user!.id!;
    Application.router.navigateTo(context, "/team/chatroom/$teamId/$userId");
  }

  void _goToTeamLogs(BuildContext context, String projectId, String role) {
    String? category;
    if (role == 'admin')
      category = 'general';
    else
      category = role;
    Application.router
        .navigateTo(context, "/team/activity/$projectId/$category");
  }

  void _showEditTeamDialog(BuildContext baseContext) {
    final team = Provider.of<TeamDetailsBloc>(baseContext, listen: false).team;
    showDialog<bool>(
      context: baseContext,
      builder: (context) {
        return AddTeamDialog(
          team.projectId!,
          isEditing: true,
          teamId: team.id,
          teamName: team.name,
          role: team.role,
        );
      },
    ).then((bool? isSuccess) {
      if (isSuccess!) {
        Provider.of<TeamDetailsBloc>(baseContext, listen: false).refresh();
      }
    });
  }
}
