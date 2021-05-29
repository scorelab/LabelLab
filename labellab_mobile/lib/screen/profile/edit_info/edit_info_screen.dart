import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/repository.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';

class EditInfoScreen extends StatefulWidget {
  final String currentUsername;

  EditInfoScreen(this.currentUsername);

  @override
  _EditInfoScreenState createState() => _EditInfoScreenState();
}

class _EditInfoScreenState extends State<EditInfoScreen> {
  final _repository = Repository();
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  final _controller = TextEditingController();

  @override
  void initState() {
    _loadUsername();
    super.initState();
  }

  void _loadUsername() =>
      setState(() => _controller.text = widget.currentUsername);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: Text("Edit Info"),
        centerTitle: true,
        elevation: 0,
      ),
      body: Container(
        padding: const EdgeInsets.symmetric(
          vertical: 10,
          horizontal: 15,
        ),
        child: Column(
          children: [
            LabelTextField(
              labelText: 'Your username',
              controller: _controller,
              hintText: 'Your username',
            ),
            SizedBox(height: 10),
            Container(
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
                child: Text('Update Info'),
                onPressed: _updateInfo,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _updateInfo() {
    String newUsername = _controller.text;
    if (newUsername.isEmpty) {
      _showError('Username cannot be empty');
      return;
    }
    _repository.editInfo(newUsername).then((res) {
      if (res.success!) {
        Application.router.pop(context);
      } else {
        _showError(res.msg!);
      }
    }).catchError((err) {
      print(err.toString());
      _showError(err.message);
    });
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.redAccent,
      ),
    );
  }
}
