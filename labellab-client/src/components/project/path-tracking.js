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
import { Icon } from 'semantic-ui-react'

class PathTracking extends Component {

  render() {
    let coordinates = []
    let marksarr = []
    this.props.project.coordinates && this.props.project.coordinates.map(point => {
      let points = {}
      let marks = {}
      if (point.length != 0) {
        points.lat = point[0]
        points.lng = point[1]
        marks.position = { lat: point[0], lng: point[1] }
        marks.showInfo = false
        marks.infoContent = false
      }
      coordinates.push(points)
      marksarr.push(marks)
    })
    const pathCoordinates = coordinates
    const markers = marksarr
    return (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={
          pathCoordinates[0] &&
            Object.keys(pathCoordinates[0]).length != 0 ?
            pathCoordinates[0] : { lat: 45, lng: -75 }
        }
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            defaultPosition={this.props.center}
            style={{ height: '2px', width: '2px' }}
          />
        ))}
        {/*for creating path with the updated coordinates*/}
        <Polyline
          path={pathCoordinates}
          geodesic={true}
          options={{
            strokeColor: "#ff2527",
            strokeOpacity: 1,
            strokeWeight: 3,
            // icons: [
            //     {
            //         icon: myIcon,
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

PathTracking.propTypes = {
  project: PropTypes.object
}

const mapStateToProps = state => {
  return {
    project: state.projects.currentProject
  }
}

export default connect(
  mapStateToProps,
  null
)(withScriptjs(withGoogleMap(PathTracking)))