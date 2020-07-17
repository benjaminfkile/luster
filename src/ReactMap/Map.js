import React from "react";
import { mapStyles } from '../ReactMap/NightMode'
import Location from '../Location'
import './Map.css'
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps";

class Map extends React.Component {

  intveral

  constructor() {
    super();
    this.state = {
      userLat: 46.833,
      userLng: -114.030,
      centerLat: 46.833,
      centerLng: -114.030,
      recenter: true
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.setLocation, 1000)
  }

  setLocation = () => {
    if (this.state.recenter) {
      this.setCenter()
    }
    this.setState({ userLat: Location.lat, userLng: Location.lng, recenter: false })
  }

  setCenter = () => {
    console.log('tick')
    this.setState({ centerLat: Location.lat, centerLng: Location.lng, recenter: true })
  }


  render = () => {
    return (
      <div>
        {!this.state.recenter &&
          <GoogleMap
            defaultZoom={16}
            defaultCenter={{ lat: this.state.centerLat, lng: this.state.centerLng }}
            defaultOptions={{ styles: mapStyles }}
          >
            <>
              <Marker position={{ lat: this.state.userLat, lng: this.state.userLng }} />
            </>

          </GoogleMap>}
        {this.state.recenter &&
          <GoogleMap
            defaultZoom={16}
            center={{ lat: this.state.centerLat, lng: this.state.centerLng }}
            defaultOptions={{ styles: mapStyles }}
      
          >
            <>
              <Marker position={{ lat: this.state.userLat, lng: this.state.userLng }} />
            </>

          </GoogleMap>}
        <button onClick={this.setCenter}>Recenter</button>
      </div>

    );
  };
}

const MapComponent = withScriptjs(withGoogleMap(Map));
//https://maps.google.com/maps/api/js?key=AIzaSyAj6zqW55nq95JI6gGGj-BtkN_hfZhJScM
export default () => (
  <MapComponent
    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
    // googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAj6zqW55nq95JI6gGGj-BtkN_hfZhJScM"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `100vh`, width: "100vw" }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);
