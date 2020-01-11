import 'dart:async';
import "package:flutter/material.dart";

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {

  @override
  void initState() {
    super.initState();
    Timer(Duration(seconds: 5), ()=>   Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => SecondRoute()),
  ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.blue,
       /*decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topRight,
          end: Alignment.bottomLeft,
          stops: [0.1, 0.5, 0.7, 0.9],
          colors: [
           Colors.blue[800],
           Colors.blue[700],
           Colors.blueAccent[800],
           Colors.blueAccent[500],
          ],
        ),
      ),*/
        child: Column(
          children: <Widget>[
          Image(
          image: AssetImage("logo.png"),
          width: 400.0,
          height: 400.0,
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(0, 10, 0, 5),
          ),
          Text(
            "LabelLab",
            style: TextStyle(color: Colors.white, fontSize: 50.0),
          ),
         Padding(
            padding: EdgeInsets.fromLTRB(0, 10, 0, 5),
          ),
         CircularProgressIndicator(
           backgroundColor: Colors.white
         ),
        ],
      ),
      )
    );
  }
}
