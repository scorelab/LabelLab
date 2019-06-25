import 'package:flutter/material.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
import 'package:labellab_mobile/data/remote/labellab_api_impl.dart';

class GithubSigninScreen extends StatefulWidget {
  GithubSigninScreen({Key key}) : super(key: key);

  _GithubSigninScreenState createState() => _GithubSigninScreenState();
}

class _GithubSigninScreenState extends State<GithubSigninScreen> {
  final FlutterWebviewPlugin _webviewPlugin = FlutterWebviewPlugin();

  @override
  void initState() {
    _webviewPlugin.onUrlChanged.listen((String url) {
      print(url);
    });
    super.initState();
  }

  @override
  void dispose() {
    _webviewPlugin.close();
    _webviewPlugin.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WebviewScaffold(
      appBar: AppBar(
        title: Text("Sign In with GitHub"),
      ),
      url: LabelLabAPIImpl.API_URL + LabelLabAPIImpl.ENDPOINT_LOGIN_GITHUB,
    );
  }
}
