import React from "react";
import { mapStyles } from '../ReactMap/NightMode'
import Location from '../Location'
//import Lightstore from '../LightStore'
import './Map.css'
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps";
import LightStore from "../LightStore";

class Map extends React.Component {

  locationInterval
  dbInterval

  constructor() {
    super();
    this.state = {
      userLat: 46.8721,
      userLng: -113.9940,
      centerLat: 46.8721,
      centerLng: -113.9940,
      recenter: true,
      lights: null,
      markers: null
    }
  }

  componentDidMount() {
    this.locationInterval = setInterval(this.setLocation, 1000)
    this.dbInterval = setInterval(this.listen4DB, 1000)
    this.setState({ lights: LightStore })
  }

  setLocation = () => {
    console.log('setting location')
    if (Location.lat) {
      if (this.state.recenter) {
        this.setCenter()
      }
      this.setState({ userLat: Location.lat, userLng: Location.lng, recenter: false })
    }
  }

  setCenter = () => {
    this.setState({ centerLat: Location.lat, centerLng: Location.lng, recenter: true })
  }

  listen4DB = () => {
    console.log('listening for db')
    if (LightStore.length > 0) {
      this.setState({ lights: LightStore })
      this.buildMarkers()
      clearInterval(this.dbInterval)
    } else {
      console.log('waiting for lights')
    }

  }

  buildMarkers() {
    console.log('building markers')
    let temp = []
    for (let i = 0; i < this.state.lights.length; i++) {
      let markerImg = new window.google.maps.MarkerImage(
        './res/' + Math.floor((Math.random() * (23 - 1) + 1)) + '.png',
        null,
        null,
        null,
        new window.google.maps.Size(40, 40)
      )
      let marker =
        <Marker
          key={i}
          onClick={() => this.onMarkerClick(i)}
          position={{ lat: parseFloat(this.state.lights[i].lat), lng: parseFloat(this.state.lights[i].lng) }}
          icon={markerImg}
        />
      temp.push(marker)
    }
    this.setState({ markers: temp })
  }

  onMarkerClick = (args) => {
    console.log(this.state.lights[args].lat)
    console.log(this.state.lights[args].lng)
  }

  render = () => {
    console.log("\nre-render")

    let locationMarker = new window.google.maps.MarkerImage(
      './res/navi-btn.png',
      null,
      null,
      null,
      new window.google.maps.Size(40, 40))

    return (
      <div>
        {!this.state.recenter &&
          <GoogleMap
            defaultZoom={12}
            defaultCenter={{ lat: this.state.centerLat, lng: this.state.centerLng }}
            defaultOptions={{ styles: mapStyles }}
          >
            <>
              {Location.lat && <Marker
                position={{ lat: this.state.userLat, lng: this.state.userLng }}
                icon={locationMarker}
              />}
            </>

          </GoogleMap>}
        {this.state.recenter &&
          <GoogleMap
            defaultZoom={12}
            center={{ lat: this.state.centerLat, lng: this.state.centerLng }}
            defaultOptions={{ styles: mapStyles }}




          >
            <>
              {Location.lat && <Marker
                position={{ lat: this.state.userLat, lng: this.state.userLng }}
                icon={locationMarker}
              />}
            </>

          </GoogleMap>}
        <button onClick={this.setCenter}>Recenter</button>
        <div className="Markers">
          {this.state.markers}
        </div>
      </div>

    );
  };
}

const MapComponent = withScriptjs(withGoogleMap(Map));
//https://maps.google.com/maps/api/js?key=AIzaSyAj6zqW55nq95JI6gGGj-BtkN_hfZhJScM
export default () => (
  <MapComponent
    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAj6zqW55nq95JI6gGGj-BtkN_hfZhJScM"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `100vh`, width: "100vw" }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);
