import React from "react";
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps";
import Location from '../Location'
import GeoData from '../GeoData'
import LightStore from "../LightStore";
import Preview from "../Preview/Preview"
import Snow from '../Snow/Snow'
import { mapStyles } from './NightMode'
import '../Map/Map.css'

class Map extends React.Component {

  locationTimeout = 0
  mapMounted = false;
  zoom = 11;
  defaultMapOptions = {
    styles: mapStyles,
    fullscreenControl: false,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    gestureHandling: 'greedy'
  };

  constructor() {
    super();
    this.state = {
      lights: null,
      markers: null,
      lightDex: -1,
      location: false,
      geoData: false,
      centered: true,
      dragged: true,
      inApp: true
    }
  }

  componentDidMount() {
    this.inApp()
    this.mapMounted = true;
    this.listen4LocationInterval = setInterval(this.listenForLocation, 1000)
    this.updateLocationInterval = setInterval(this.updateLocation, 1000)
    this.dbInterval = setInterval(this.listen4DB, 100)
    this.geoInterval = setInterval(this.listen4GEO, 100)
    this.setState({ lights: LightStore })
  }

  inApp = () => {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    if (!(ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf('Instagram') > -1)) {
      this.setState({ inApp: false })
    }
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
    if (Location.lat && !this.state.inApp && this.mapMounted) {
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

  updateLocation = () => {
    if (!this.state.recenter && !this.state.inApp && Location.lat && this.mapMounted) {
      this.setState({ location: true })
    }
  }

  listen4GEO = () => {
    if (GeoData[0] && this.mapMounted) {
      this.setState({ geoData: true })
      clearInterval(this.geoInterval)
    }
  }

  recenter = () => {
    this.setState({ centered: true })
    this.setState({ dragged: false })
  }

  dragged = () => {
    this.setState({ centered: false })
    this.setState({ dragged: true })
  }

  togglePreview = (args) => {
    this.setState({ lightDex: args })
  }

  buildMarkers = () => {

    let temp = []
    for (let i = 0; i < this.state.lights.length; i++) {
      if (this.state.lights[i].flag === "0") {
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
    }

    this.setState({ markers: temp })
  }

  render = () => {

    console.log('render')
    // console.log(this.context)

    let locationMarker = new window.google.maps.MarkerImage(
      './res/location-marker.png',
      null,
      null,
      null,
      new window.google.maps.Size(50, 50))



    return (
      <div>
        {/*LIKELINESS = 1*/}
        {/*Location refused but found GeoData*/}
        {!this.state.location && this.state.geoData && <GoogleMap 
          defaultZoom={11}
          defaultCenter={{ lat: GeoData[0].latitude, lng: GeoData[0].longitude }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
        > 
          <>
          </>
        </GoogleMap>}

        {/*LIKELINESS = 2*/}
        {/*has Location and map is centered*/}
        {this.state.location && this.state.centered && <GoogleMap
          defaultZoom={11}
          center={{ lat: Location.lat, lng: Location.lng }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
        >
          <>
            {this.state.location && <Marker
              position={{ lat: Location.lat + .00001, lng: Location.lng + .00001 }}
              icon={locationMarker}
            />}
          </>
        </GoogleMap>}

        {/*LIKELINESS = 3*/}
        {/*has Location and user drags map*/}
        {this.state.location && this.state.dragged && <GoogleMap
          defaultZoom={11}
          defaultCenter={{ lat: Location.lat, lng: Location.lng }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
        >
          <>
            <Marker
              position={{ lat: Location.lat + .00001, lng: Location.lng + .00001 }}
              icon={locationMarker}
            />
          </>
        </GoogleMap>}

        {/*LIKELINESS = 4*/}
        {/*no Location or GeoData*/}
        {!this.state.location && <GoogleMap
          defaultZoom={11}
          defaultCenter={{ lat: 37.0902, lng: -95.7129 }}
          defaultOptions={this.defaultMapOptions}

        >
          <>
          </>
        </GoogleMap>}
        {!this.state.centered && this.state.location && <div className="Recenter" onClick={this.recenter}>
          <p>Recenter</p>
        </div>}
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
