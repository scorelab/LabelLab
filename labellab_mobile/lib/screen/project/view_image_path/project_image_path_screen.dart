import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:labellab_mobile/screen/project/view_image_path/project_image_path_bloc.dart';
import 'package:labellab_mobile/screen/project/view_image_path/project_image_path_state.dart';
import 'package:provider/provider.dart';

class ProjectImagePathScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: Provider.of<ProjectImagePathBloc>(context).state,
      initialData: ProjectImagePathState.loading(),
      builder: (BuildContext context,
          AsyncSnapshot<ProjectImagePathState> snapshot) {
        if (snapshot.hasData) {
          ProjectImagePathState _state = snapshot.data;
          return Scaffold(
            appBar: AppBar(
              title: Text("Object Path"),
              elevation: 0,
            ),
            body: _state.isLoading
                ? LinearProgressIndicator()
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      _state.labels != null
                          ? Wrap(
                              spacing: 8,
                              children: _state.labels.map((label) {
                                return InkWell(
                                  child: Chip(
                                    label: Text(label.name),
                                  ),
                                  onTap: () => _updateMap(context, label.id),
                                );
                              }).toList(),
                            )
                          : Container(),
                      Expanded(
                        child: _state.locations != null
                            ? Container(
                                margin: EdgeInsets.symmetric(vertical: 4.0),
                                child: _state.locations != null
                                    ? GoogleMap(
                                        mapType: MapType.hybrid,
                                        initialCameraPosition: CameraPosition(
                                          target: LatLng(
                                              _state.locations.first.latitude,
                                              _state.locations.first.longitude),
                                          zoom: 12,
                                        ),
                                        onMapCreated:
                                            (GoogleMapController controller) {},
                                        markers: _state.locations
                                            .map(
                                              (location) => Marker(
                                                markerId:
                                                    MarkerId(location.name),
                                                position: LatLng(
                                                    location.latitude,
                                                    location.longitude),
                                                infoWindow: InfoWindow(
                                                    title: location.name),
                                              ),
                                            )
                                            .toSet(),
                                      )
                                    : Text(
                                        "Need more data to generate the path"),
                              )
                            : Center(
                                child: Container(
                                  child: Text("Please select a label first"),
                                ),
                              ),
                      ),
                    ],
                  ),
          );
        }
        return Container();
      },
    );
  }

  void _updateMap(BuildContext context, String labelId) {
    Provider.of<ProjectImagePathBloc>(context).selectLabel(labelId);
  }
}
