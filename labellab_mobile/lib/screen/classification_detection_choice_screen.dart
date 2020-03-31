import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:labellab_mobile/routing/application.dart';

class ClassificationDetectionChoiceScreen extends StatelessWidget {
  String selector;

  ClassificationDetectionChoiceScreen(this.selector);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        title: Text('Choose'),
        centerTitle: true,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            OutlineButton(
              padding: EdgeInsets.all(24.0),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
              onPressed: () {_goToDetect(context);},
              child: Text('Object Detection',style: TextStyle(fontSize: 24),),
            ),
            SizedBox(height: 30,),
            OutlineButton(
              padding: EdgeInsets.all(24.0),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
              onPressed: (){_goToClassify(context);},
              child: Text('Classification',style: TextStyle(fontSize: 24),),
            )
          ],
        ),
      ),
    );
  }


  void _goToClassify(BuildContext context) {
    Application.router
        .navigateTo(context, '/classify/'+ this.selector);
  }


  void _goToDetect(BuildContext context) {
    Application.router
        .navigateTo(context, '/detect/'+ this.selector);
  }
}
