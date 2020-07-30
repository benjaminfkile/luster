import React from "react";
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps";
import Location from '../Location'
import LightStore from "../LightStore";
import Preview from "../Preview/Preview"
import Snow from '../Snow/Snow'
import { mapStyles } from '../ReactMap/NightMode'
import './Map.css'

class Map extends React.Component {

  locationTimeout = 0

  constructor() {
    super();
    this.state = {
      lights: null,
      markers: null,
      lightDex: -1,
      location: false
    }
  }

  componentDidMount() {
    this.locationInterval = setInterval(this.updateLocation, 2000)
    this.dbInterval = setInterval(this.listen4DB, 100)
    this.setState({ lights: LightStore })
  }

  listen4DB = () => {
    if (LightStore.length > 0) {
      this.setState({ lights: LightStore })
      this.buildMarkers()
      clearInterval(this.dbInterval)
    }
  }

  updateLocation = () =>{
    if(Location.lat){
      this.setState({location: true})
    }else{
      this.setState({location: false})
      this.locationTimeout ++
      if(this.locationTimeout > 9){
        clearInterval(this.locationInterval)
      }
    }
  }

  togglePreview = (args) => {
    this.setState({ lightDex: args })
  }

  buildMarkers() {
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
          onClick={() => this.togglePreview(i)}
          position={{ lat: parseFloat(this.state.lights[i].lat), lng: parseFloat(this.state.lights[i].lng) }}
          icon={markerImg}
        />
      temp.push(marker)
    }
    this.setState({ markers: temp })
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
      mapTypeControl: false,
      gestureHandling: 'greedy'
    };

    return (
      <div>
        {this.state.location && <GoogleMap
          defaultZoom={12}
          defaultCenter={{ lat: Location.lat, lng: Location.lng }}
          defaultOptions={defaultMapOptions}
        >
          <>
            <Marker
              position={{ lat: Location.lat, lng: Location.lng }}
              icon={locationMarker}
            />
          </>
        </GoogleMap>}

        {!this.state.location && <GoogleMap
          defaultZoom={12}
          defaultCenter={{ lat: 46.8721, lng: -113.9940 }}
          defaultOptions={defaultMapOptions}
        >
          <>
          </>
        </GoogleMap>}

        <div className="Markers">
          {this.state.markers}
        </div>
        <Preview
          togglePreview={this.togglePreview}
          lightDex={this.state.lightDex}
        />
        <Snow />
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
