import React, { Component } from "react";
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline
} from "react-google-maps";

class PathTracking extends Component {
  render() {
    const pathCoordinates = [
        { lat: 36.05298765935, lng: -112.083756616339 },
        { lat: 36.2169884797185, lng: -112.056727493181 }
    ];
    return (
        <GoogleMap
            defaultZoom={10}
            defaultCenter={{lat:45,lng:-75}}
        >
            {/*for creating path with the updated coordinates*/}
            <Polyline
                path={pathCoordinates}
                geodesic={true}
                options={{
                    strokeColor: "#ff2527",
                    strokeOpacity: 0.75,
                    strokeWeight: 2,
                    // icons: [
                    //     {
                    //         icon: lineSymbol,
                    //         offset: "0",
                    //         repeat: "20px"
                    //     }
                    // ]
                }}
            />
        </GoogleMap>
    );
  }
}

export default connect(
  null,
  null
)(withScriptjs(withGoogleMap(PathTracking)))