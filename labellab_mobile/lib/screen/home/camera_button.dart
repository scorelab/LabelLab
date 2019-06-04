import 'package:flutter/material.dart';

class CameraButton extends StatelessWidget {

  final VoidCallback onTap;

  const CameraButton({Key key, this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      shape: CircleBorder(),
      color: Theme.of(context).accentColor,
      elevation: 4,
      child: InkWell(
        child: Padding(
          padding: const EdgeInsets.all(42.0),
          child: Icon(
            Icons.camera_alt,
            size: 96,
            color: Theme.of(context).primaryColor,
          ),
        ),
        onTap: onTap,
      ),
    );
  }
}
