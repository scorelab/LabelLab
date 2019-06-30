import 'package:flutter/material.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
import 'package:labellab_mobile/data/remote/labellab_api_impl.dart';

class GithubSigninScreen extends StatefulWidget {
  GithubSigninScreen({Key key}) : super(key: key);

  _GithubSigninScreenState createState() => _GithubSigninScreenState();
}

class _GithubSigninScreenState extends State<GithubSigninScreen> {
  final authUrl =
      "${LabelLabAPIImpl.API_URL}${LabelLabAPIImpl.ENDPOINT_LOGIN_GITHUB}";
  final FlutterWebviewPlugin _webviewPlugin = FlutterWebviewPlugin();

  @override
  void initState() {
    _webviewPlugin.onStateChanged.listen((WebViewStateChanged state) {
      if (state.type == WebViewState.abortLoad) {
        print(state.url);
        if (state.url.startsWith("$authUrl/callback")) {
          Navigator.pop(context, state.url.split("=")[1]);
        }
      }
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
      url: authUrl,
      invalidUrlRegex: "$authUrl/callback.*",
    );
  }
}
