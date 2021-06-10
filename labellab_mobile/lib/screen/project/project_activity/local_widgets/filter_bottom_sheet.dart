import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_bloc.dart';
import 'package:labellab_mobile/screen/project/detail/project_detail_state.dart';
import 'package:labellab_mobile/screen/project/project_activity/local_widgets/filter_dropdown.dart';
import 'package:provider/provider.dart';

class FilterBottomSheet extends StatefulWidget {
  @override
  _FilterBottomSheetState createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  Repository _repository = new Repository();
  int _filteringOption = 0;
  String _selectedCategory = 'all';
  String? _selectedMember;
  final _filteringOptions = [
    'Show all logs',
    'Show category specific logs',
    'Show member specific logs',
  ];
  final _categoryOptions = [
    'all',
    'general',
    'images',
    'labels',
    'models',
    'image labelling',
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 280,
      margin: const EdgeInsets.all(5),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(5),
      ),
      child: StreamBuilder<ProjectDetailState>(
        stream: Provider.of<ProjectDetailBloc>(context).state,
        builder: (context, snapshot) {
          List<String> _members = [];
          if (snapshot.connectionState != ConnectionState.waiting &&
              snapshot.hasData) {
            final _project = snapshot.data!.project;
            if (_project != null) {
              _members =
                  _project.members!.map((member) => member.email!).toList();
              _selectedMember = _members[0];
            }
          }
          return Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Filtering Options',
                    style: Theme.of(context).textTheme.headline6,
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 15),
                  FilterDropdown(_filteringOptions, _setFilteringOption),
                  SizedBox(height: 5),
                  _filteringOption == 1
                      ? FilterDropdown(
                          _categoryOptions,
                          _setCategory,
                          isDisabled: _filteringOption != 1,
                        )
                      : Container(),
                  SizedBox(height: 5),
                  _members.isEmpty
                      ? Container()
                      : _filteringOption == 2
                          ? FilterDropdown(
                              _members,
                              _setSelectMember,
                              isDisabled: _filteringOption != 2,
                            )
                          : Container(),
                  SizedBox(height: 25),
                ],
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  elevation: 0,
                  primary: Theme.of(context).accentColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: EdgeInsets.symmetric(vertical: 16.0),
                ),
                child: Text("Save"),
                onPressed: _applyFilteringOptions,
              ),
            ],
          );
        },
      ),
    );
  }

  void _applyFilteringOptions() {
    String projectId =
        Provider.of<ProjectDetailBloc>(context, listen: false).projectId;
    if (_filteringOption == 0) {
      _repository
          .getProjectActivityLogs(projectId)
          .then((logs) => Navigator.of(context).pop(logs));
    } else if (_filteringOption == 1) {
      _repository
          .getCategorySpecificLogs(projectId, _selectedCategory)
          .then((logs) => Navigator.of(context).pop(logs));
    } else {
      _repository
          .getMemberSpecificLogs(projectId, _selectedMember!)
          .then((logs) => Navigator.of(context).pop(logs));
    }
  }

  void _setFilteringOption(String value) {
    setState(() {
      _filteringOption = _filteringOptions.indexOf(value);
    });
  }

  void _setCategory(String value) {
    _selectedCategory = value;
  }

  void _setSelectMember(String memberUsername) {
    _selectedMember = memberUsername;
  }
}
