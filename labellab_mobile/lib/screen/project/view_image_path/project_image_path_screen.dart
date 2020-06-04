import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:labellab_mobile/model/location.dart';
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
        List<Location> locations = snapshot.data.locations;
        return Scaffold(
          appBar: AppBar(
            title: Text("Image Path"),
            elevation: 0,
          ),
          body: locations != null
              ? Container(
                  margin: EdgeInsets.symmetric(vertical: 4.0),
                  child: GoogleMap(
                    mapType: MapType.hybrid,
                    initialCameraPosition: CameraPosition(
                      target: LatLng(
                          locations.first.latitude, locations.first.longitude),
                      zoom: 12,
                    ),
                    onMapCreated: (GoogleMapController controller) {},
                    markers: locations
                        .map(
                          (location) => Marker(
                            markerId: MarkerId(location.name),
                            position:
                                LatLng(location.latitude, location.longitude),
                            infoWindow: InfoWindow(title: location.name),
                          ),
                        )
                        .toSet(),
                  ),
                )
              : Container(),
        );
      },
    );
  }
}
