class Location {
  String name;
  double latitude;
  double longitude;

  Location({this.name = "", this.latitude, this.longitude});

  Location.fromJson(dynamic json) {
    name = json['name'];
    latitude = double.parse(json['latitude'].toString());
    longitude = double.parse(json['longitude'].toString());
  }
}
