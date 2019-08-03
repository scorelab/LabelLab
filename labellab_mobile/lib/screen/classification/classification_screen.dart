import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:labellab_mobile/model/classification.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/screen/classification/classification_bloc.dart';
import 'package:labellab_mobile/screen/classification/classification_state.dart';
import 'package:provider/provider.dart';

class ClassificationScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Classfication"),
        centerTitle: true,
        elevation: 2,
        actions: <Widget>[
          PopupMenuButton<int>(
            onSelected: (selected) {
              if (selected == 0) {
                _showOnDeleteAlert(context);
              }
            },
            itemBuilder: (context) {
              return [
                PopupMenuItem(
                  value: 0,
                  child: Text("Delete"),
                )
              ];
            },
          )
        ],
      ),
      body: StreamBuilder(
        stream: Provider.of<ClassificationBloc>(context).state,
        builder: (context, AsyncSnapshot<ClassificationState> snapshot) {
          if (snapshot.hasData) {
            final ClassificationState state = snapshot.data;
            return ListView(
              children: <Widget>[
                state.isLoading
                    ? LinearProgressIndicator(
                        backgroundColor: Theme.of(context).canvasColor,
                      )
                    : Container(
                        height: 6,
                      ),
                state.error != null
                    ? ListTile(
                        title: Text(state.error),
                      )
                    : Container(),
                state.classification != null
                    ? _buildClassification(context, state.classification)
                    : Container(),
              ],
            );
          } else {
            return Text("No data");
          }
        },
      ),
    );
  }

  Widget _buildClassification(
      BuildContext context, Classification classification) {
    return Column(
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.all(12.0),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image(
              image: CachedNetworkImageProvider(classification.imageUrl),
              fit: BoxFit.cover,
              height: 320,
            ),
          ),
        ),
        ListTile(
          title: Text("Labels"),
          subtitle: Row(
            children: classification.label != null
                ? classification.label.map((label) {
                    return Chip(
                      label: Text(label.name),
                    );
                  }).toList()
                : [],
          ),
        ),
        classification.createdAt != null
            ? ListTile(
                title: Text("Classified at"),
                subtitle: Text(
                  DateFormat.yMd().format(classification.createdAt),
                ),
              )
            : Container(),
      ],
    );
  }

  void _showOnDeleteAlert(BuildContext baseContext) {
    showDialog(
        context: baseContext,
        builder: (context) {
          return AlertDialog(
            title: Text("Delete"),
            content: Text("Are you sure?"),
            actions: <Widget>[
              ButtonBar(
                children: <Widget>[
                  FlatButton(
                    child: Text("No"),
                    onPressed: () {
                      Navigator.pop(context, false);
                    },
                  ),
                  FlatButton(
                    child: Text("Yes"),
                    onPressed: () {
                      Provider.of<ClassificationBloc>(baseContext).delete();
                      Navigator.pop(context, true);
                    },
                  ),
                ],
              )
            ],
          );
        }).then((isDeleted) {
      Application.router.pop(baseContext);
    });
  }
}
