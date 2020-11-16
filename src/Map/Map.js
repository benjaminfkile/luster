import React from "react";
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps";
import KeyStore from '../KeyStore'
import Location from '../Location'
import LightStore from "../LightStore";
import Preview from "../Preview/Preview"
import Radar from '../Radar'
import Snow from '../Snow/Snow'
import Search from '../Search/Search'
import { mapStyles } from './NightMode'

import '../Map/Map.css'
import { timeHours } from "d3";

class Map extends React.Component {

  locationTimeout = 0
  mapMounted = false;
  defaultMapOptions = {
    styles: mapStyles,
    fullscreenControl: false,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    gestureHandling: 'greedy',
    zoom: 11,
    minZoom: 4,
    maxZoom: 15
  };

  constructor() {
    super();
    this.state = {
      lights: null,
      markers: null,
      lightDex: -1,
      location: false,
      centered: true,
      dragged: true,
      nearest: false,
      inApp: true,
      target: null,
      search: false
    }
  }

  componentDidMount() {
    this.inApp()
    this.mapMounted = true;
    this.listen4LocationInterval = setInterval(this.listenForLocation, 500)
    this.updateLocationInterval = setInterval(this.updateLocation, 1000)
    this.dbInterval = setInterval(this.listen4DB, 500)
    this.radarInterval = setInterval(this.listen4Radar, 500)
    this.queryInterval = setInterval(this.listenForQuery, 500)
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
    console.log('listenign for location')
    if (Location.lat && !this.state.inApp && this.mapMounted) {
      this.setState({ location: true })
      clearInterval(this.listen4LocationInterval)
    } else {
      this.setState({ location: false })
      this.locationTimeout++
      if (this.locationTimeout > 19) {
        clearInterval(this.listen4LocationInterval)
      }
    }
  }

  updateLocation = () => {
    if (!this.state.recenter && !this.state.inApp && Location.lat && this.mapMounted) {
      this.setState({ location: true })
    }
    if (!this.state.dragged) {
      this.setState({ centered: true })
    }
  }

  listen4Radar = () => {
    if (Radar.targets.length > 0 && this.mapMounted) {
      this.setState({ target: Radar.targets[0][0] })
      clearInterval(this.radarInterval)
    }
  }

  listenForQuery = () => {
    if (this.state.target && this.state.target !== Radar.targets[0][0] && this.mapMounted) {
      this.setState({ target: Radar.targets[0][0], lights: LightStore })
      this.dragged()
      this.buildMarkers()
    }
  }

  findNearest = () => {
    this.setState({ nearest: true })
    this.setState({ dragged: true })
    this.setState({ centered: false })
  }

  recenter = () => {
    this.setState({ centered: true })
    this.setState({ dragged: false })
    this.setState({ nearest: false })
  }

  dragged = () => {
    this.setState({ centered: false })
    this.setState({ dragged: true })
    this.setState({ nearest: false })
  }

  togglePreview = (args) => {
    this.setState({ lightDex: args })
  }

  toggleSearch = () => {
    if (this.state.search) {
      this.setState({ search: false })
    } else {
      this.setState({ search: true })
    }
  }

  buildMarkers = () => {

    let temp = []
    for (let i = 0; i < this.state.lights.length; i++) {
      let markerImg = new window.google.maps.MarkerImage(
        './res/' + this.state.lights[i].icon + '.png',
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
          zIndex={1005}
        />
      temp.push(marker)
    }

    this.setState({ markers: temp })
  }

  render = () => {

    if (this.state.lights && this.state.lights.length > 0) {
      console.log(this.state.lights.length)
    }

    let locationMarker = new window.google.maps.MarkerImage(
      './res/location-marker.png',
      null,
      null,
      null,
      new window.google.maps.Size(50, 50))

    return (
      <div className="Map">
        {LightStore.length === 0 && <Search />}
        {this.state.search && <Search toggled={true} />}
        {/*center over nearest*/}
        {this.state.nearest && Radar.targets[0][1].lat && <GoogleMap
          center={{ lat: Number(Radar.targets[0][1].lat), lng: Number(Radar.targets[0][1].lng) }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
        >
          <>
          </>
          <Marker
            position={{ lat: Number(Radar.targets[0][1].lat), lng: Number(Radar.targets[0][1].lng) }}
            icon={locationMarker}
          />
        </GoogleMap>}

        {/*center over location*/}
        {this.state.location && this.state.centered && <GoogleMap
          center={{ lat: Location.lat, lng: Location.lng }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
        >
          <>
            {this.state.location && <Marker
              position={{ lat: Location.lat, lng: Location.lng }}
              icon={locationMarker}
            />}
          </>
        </GoogleMap>}

        {/*has Location and user drags map*/}
        {this.state.location && this.state.dragged && <GoogleMap
          defaultCenter={{ lat: Location.lat, lng: Location.lng }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
        >
          <>
            {!this.state.nearest && <Marker
              position={{ lat: Location.lat + .00001, lng: Location.lng + .00001 }}
              icon={locationMarker}
            />}
          </>
        </GoogleMap>}

        {/*no Location, center of USA*/}
        {!this.state.location && <GoogleMap
          defaultCenter={{ lat: 37.0902, lng: -95.7129 }}
          defaultOptions={this.defaultMapOptions}
        >
          <>
          </>
        </GoogleMap>}

        <div className="Map_Controls">
          {!this.state.centered && this.state.location && <div className="Recenter" onClick={this.recenter}>
            <p>Recenter</p>
          </div>}
          {!this.state.nearest && <div className="Nearest" onClick={this.findNearest}>
            <p>Nearest</p>
          </div>}
        </div>

        <div className="Search_Toggle">
          <img src="./res/pin.png" alt="oops" onClick={this.toggleSearch}></img>
        </div>
        <div className="Markers">
          {this.state.markers}
        </div>

        {!this.state.search && <Preview
          togglePreview={this.togglePreview}
          lightDex={this.state.lightDex}
          contributions={false}
          lights={LightStore}
        />}
        <Snow />
      </div>
    );
  };
}

const MapComponent = withScriptjs(withGoogleMap(Map));
export default () => (
  <MapComponent
    googleMapURL={KeyStore.mapUrl}
    loadingElement={<div style={{ height: `100vh` }} />}
    containerElement={<div style={{ height: `100vh`, width: "100vw" }} />}
    mapElement={<div style={{ height: `100vh` }} />}
  />
);
