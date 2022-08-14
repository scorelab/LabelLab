import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/screen/issue/issue_activity/issue_activity_state.dart';
import 'package:labellab_mobile/screen/project/project_activity/local_widgets/filter_dropdown.dart';
import 'package:provider/provider.dart';

import '../issue_activity_bloc.dart';

class FilterIssueSheet extends StatefulWidget {
  @override
  _FilterIssueSheetState createState() => _FilterIssueSheetState();
}

class _FilterIssueSheetState extends State<FilterIssueSheet> {
  Repository _repository = new Repository();
  int _filteringOption = 0;
  String _selectedCategory = 'all';
  String? _selectedTeam;
  String? _selectPriority = 'Low';

  final _filteringOptions = [
    'Show all issues',
    'Show category specific issues',
    'Show Priroty specific issues',
    // 'Show Team specific issue',
  ];
  final _categoryOptions = [
    'all',
    'general',
    'images',
    'labels',
    'models',
    'image labelling',
  ];

  final _prirotyOptions = ["Critical", "High", "Medium", "Low"];

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
      child: StreamBuilder<IssueActivityState>(
        stream: Provider.of<IssueActivityBloc>(context).issues,
        builder: (context, snapshot) {
          List<String> _teams = [];

          
          if (snapshot.connectionState != ConnectionState.waiting &&
              snapshot.hasData) {
            final _issues = snapshot.data!.issues;
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
                  _filteringOption == 2
                      ? FilterDropdown(
                          _prirotyOptions,
                          _setPriority,
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
        Provider.of<IssueActivityBloc>(context, listen: false).projectId;
    if (_filteringOption == 0) {
      _repository
          .getIssues(projectId)
          .then((issues) => Navigator.of(context).pop(issues));
    } else if (_filteringOption == 1) {
      _repository
          .getCategorySpecificIssue(projectId, _selectedCategory)
          .then((issues) => Navigator.of(context).pop(issues));
    } else if (_filteringOption == 2) {
    } else {

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

  void _setSelectTeam(String teamName) {
    _selectedTeam = teamName;
  }

  void _setPriority(String priority) {
    _selectPriority = priority;
  }
}
