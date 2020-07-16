import React from "react";
import { mapStyles } from '../ReactMap/NightMode'
import Location from '../Location'
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker
} from "react-google-maps";

class Map extends React.Component {
  intveral

  constructor() {
    super();
    this.state = {
      userLat: 46.833,
      userLng: -114.030
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.setLocation, 10000)
  }

  setLocation = () => {
    this.setState({ userLat: Location.lat, userLng: Location.lng })
  }



  render = () => {
    console.log(this.state)
    return (
      <GoogleMap
        defaultCenter={{ lat: this.state.userLat, lng: this.state.userLng }}
        // center={{ lat: this.state.userLat, lng: this.state.userLng }}
        options={{
          zoom: 15,
          fullscreenControl: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          styles: mapStyles
        }}
      >
        <>

          <Marker
            position={{ lat: this.state.userLat, lng: this.state.userLng }}
          />
        </>
        )
      </GoogleMap>
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
