import 'package:flutter/material.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/backend_selection/backend_service_selector.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';

class BackendSelectionScreen extends StatefulWidget {
  const BackendSelectionScreen({Key? key}) : super(key: key);

  @override
  _BackendSelectionScreenState createState() => _BackendSelectionScreenState();
}

class _BackendSelectionScreenState extends State<BackendSelectionScreen> {
  bool _isEditing = false;
  final _controller = TextEditingController();

  @override
  void initState() {
    _checkIfEditing();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Configure Backend'),
        centerTitle: true,
        elevation: 0,
      ),
      body: Container(
        padding: const EdgeInsets.all(15),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              'Enter the URL of the backend service instance of LabelLab you want to connect to',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.black87,
                fontSize: 16,
              ),
            ),
            SizedBox(height: 15),
            Text(
              'For example:\nhttp://192.186.0.1:5000/',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.black54,
                fontSize: 18,
              ),
            ),
            SizedBox(height: 25),
            LabelTextField(
              labelText: 'Backend URL',
              controller: _controller,
              hintText: 'http://<ip_address>:<port_number>/',
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
                child: Text(_isEditing ? 'Update' : 'Save'),
                onPressed: _saveBackendURL,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _checkIfEditing() async {
    String? backendUrl =
        await BackendServiceSelector().getBackendURLFromLocalStorage();
    if (backendUrl != null) {
      setState(() {
        _isEditing = true;
        _controller.text = backendUrl;
      });
    }
  }

  void _saveBackendURL() {
    String backendUrl = _controller.text;
    if (backendUrl.isEmpty) {
      _showError('Please provide a URL');
      return;
    }
    bool isValidUrl = Uri.parse(backendUrl).isAbsolute;
    if (!isValidUrl) {
      _showError('Invalid URL');
      return;
    }
    BackendServiceSelector().saveURLToLocalStorage(backendUrl);
    if (_isEditing) {
      Application.router.pop(context);
    } else {
      Application.router.navigateTo(context, '/', replace: true);
    }
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
