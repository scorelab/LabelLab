import 'dart:async';
import 'package:flutter/material.dart';
import 'package:labellab_mobile/data/remote/labellab_api_impl.dart';
import 'package:webview_flutter/webview_flutter.dart';

class GithubSigninScreen extends StatefulWidget {
  @override
  GithubSigninScreenState createState() => GithubSigninScreenState();
}

class GithubSigninScreenState extends State<GithubSigninScreen> {
  final String loginUrl =
      LabelLabAPIImpl.API_URL + LabelLabAPIImpl.ENDPOINT_LOGIN_GITHUB;
  final Completer<WebViewController> _controller =
      Completer<WebViewController>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sign In with GitHub'),
      ),
      body: Builder(builder: (BuildContext context) {
        return WebView(
          initialUrl: loginUrl,
          javascriptMode: JavascriptMode.unrestricted,
          onWebViewCreated: (WebViewController webViewController) {
            _controller.complete(webViewController);
          },
          navigationDelegate: (NavigationRequest request) {
            if (request.url.startsWith(loginUrl + "/callback")) {
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
          onPageFinished: (String url) {
            if (url.startsWith(loginUrl + "/callback")) {
              final String code = url.split("=")[1];
              Navigator.pop(context, code);
            }
          },
        );
      }),
    );
  }
}
