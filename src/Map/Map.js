import React from "react";
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps";
import Location from '../Location'
import LightStore from "../LightStore";
import Preview from "../Preview/Preview"
import Snow from '../Snow/Snow'
import { mapStyles } from './NightMode'
import '../Map/Map.css'

class Map extends React.Component {

  locationTimeout = 0
  mapMounted = false;

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
    this.mapMounted = true;
    this.listen4LocationInterval = setInterval(this.listenForLocation, 1000)
    this.dbInterval = setInterval(this.listen4DB, 100)
    this.setState({ lights: LightStore })
  }

  componentWillUnmount() {
    this.mapMounted = false;
  }

  listen4DB = () => {
    if (LightStore.length > 0 && this.mapMounted) {
      this.setState({ lights: LightStore })
      this.buildMarkers()
      clearInterval(this.dbInterval)
    }
  }

  listenForLocation = () => {
    if (Location.lat && this.mapMounted) {
      this.setState({ location: true })
      clearInterval(this.listen4LocationInterval)
    } else {
      this.setState({ location: false })
      this.locationTimeout++
      if (this.locationTimeout > 19) {
        console.log('location denied')
        clearInterval(this.listen4LocationInterval)
      }
    }
  }

  recenter = () => {
    if(this.mapMounted && Location.lat){
      this.setState({location: true})
    }
  }

  togglePreview = (args) => {
    this.setState({ lightDex: args })
    if(this.state.lightDex > -1){
      console.log(LightStore[this.state.lightDex].id)
    }

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

    console.log("render")

    const defaultMapOptions = {
      styles: mapStyles,
      fullscreenControl: false,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      gestureHandling: 'greedy'
    };

    return (
      <div>
        {this.state.location && <GoogleMap
          defaultZoom={12}
          center={{ lat: Location.lat, lng: Location.lng }}
          defaultOptions={defaultMapOptions}
        >
          <>
          </>
        </GoogleMap>}
        {!this.state.location && <GoogleMap
          defaultZoom={12}
          center={{ lat: 46.8721, lng: -113.9940 }}
          defaultOptions={defaultMapOptions}
        >
          <>
          </>
        </GoogleMap>}
        <div className="Recenter" onClick={this.recenter}>
          <p>Recenter</p>
        </div>
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
export default () => (
  <MapComponent
    // googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAj6zqW55nq95JI6gGGj-BtkN_hfZhJScM"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `100vh`, width: "100vw" }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);
