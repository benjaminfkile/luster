import React from "react";
import { mapStyles } from '../ReactMap/NightMode'
import Location from '../Location'
import './Map.css'
import Snow from '../Snow/Snow'
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps";
import LightStore from "../LightStore";

class Map extends React.Component {

  locationInterval
  locationAttempts = 0
  dbInterval

  constructor() {
    super();
    this.state = {
      userLat: 46.8721,
      userLng: -113.9940,
      lights: null,
      markers: null
    }
  }

  componentDidMount() {
    this.locationInterval = setInterval(this.listen4Location, 1000)
    this.dbInterval = setInterval(this.listen4DB, 1000)
    this.setState({ lights: LightStore })
  }

  listen4Location = () => {
    this.locationAttempts += 1
    console.log("\nlocation attempt: " + this.locationAttempts)
    if (this.locationAttempts > 30 || Location.lat) {
      clearInterval(this.locationInterval)
      this.setCenter()
    }
  }

  setCenter = () => {
    if(Location.lat){
      this.setState({userLat: Location.lat, userLng: Location.lng})
    }
  }


  listen4DB = () => {
    console.log('\nlistening for db')
    if (LightStore.length > 0) {
      this.setState({ lights: LightStore })
      this.buildMarkers()
      clearInterval(this.dbInterval)
    }

  }

  buildMarkers() {
    console.log('\nbuilding markers')
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

    console.log("\nrender")

    let locationMarker = new window.google.maps.MarkerImage(
      './res/navi-btn.png',
      null,
      null,
      null,
      new window.google.maps.Size(40, 40))

      const defaultMapOptions = {
        styles: mapStyles,
        fullscreenControl: false,
        zoomControl: false,
        mapTypeControl: false
      };

    return (
      <div>

        <GoogleMap
          defaultZoom={12}
          center={{ lat: this.state.userLat, lng: this.state.userLng }}
          // defaultOptions={{ styles: mapStyles }}
          defaultOptions={defaultMapOptions}
          gestureHandling='greedy'
        >
          <>
            {Location.lat && <Marker
              position={{ lat: this.state.userLat, lng: this.state.userLng }}
              icon={locationMarker}
            />}
          </>

        </GoogleMap>
        <div className="Recenter" onClick={this.setCenter}>Recenter</div>
        <div className="Markers">
          {this.state.markers}
        </div>
        <Snow
        // credit to https://pajasevi.github.io/CSSnowflakes/
        />
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
