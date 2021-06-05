import 'package:flutter/material.dart';
import 'package:labellab_mobile/screen/project/project_activity/local_widgets/filter_dropdown.dart';

class FilterBottomSheet extends StatefulWidget {
  @override
  _FilterBottomSheetState createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
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
      height: 350,
      margin: const EdgeInsets.all(5),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(5),
      ),
      child: Column(
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
          FilterDropdown(
            _categoryOptions,
            _setCategory,
            isDisabled: _filteringOption != 1,
          ),
          SizedBox(height: 5),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: TextField(
              onTap: _openSearchMemberScreen,
              controller: null,
              decoration: new InputDecoration(
                hintText: 'Name of project member',
                labelText: 'Project member name',
                labelStyle: TextStyle(color: Colors.black45),
                filled: true,
                fillColor: Colors.black12,
                border: InputBorder.none,
              ),
            ),
          ),
          SizedBox(height: 25),
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
      ),
    );
  }

  void _applyFilteringOptions() {
    print(_filteringOption);
    print(_selectedCategory);
    print(_selectedMember);
  }

  void _setCategory(String value) {
    _selectedCategory = value;
  }

  void _setFilteringOption(String value) {
    setState(() {
      _filteringOption = _filteringOptions.indexOf(value);
    });
  }

  void _openSearchMemberScreen() {
    FocusScope.of(context).requestFocus(new FocusNode());
    if (_filteringOption != 2) return;
    print('Test');
  }
}
