import React from "react";
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps";
import Search from '../Search/Search'
import KeyStore from '../KeyStore'
import Location from '../Location'
import LightStore from "../LightStore";
import Preview from "../Preview/Preview"
import Radar from '../Radar'
import Snow from '../Snow/Snow'
import { mapStyles } from './NightMode'
import { Link } from 'react-router-dom'

import '../Map/Map.css'

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
    // minZoom: 8,
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
      inApp: true
    }
  }

  componentDidMount() {
    this.inApp()
    this.mapMounted = true;
    this.listen4LocationInterval = setInterval(this.listenForLocation, 1000)
    this.updateLocationInterval = setInterval(this.updateLocation, 1000)
    this.dbInterval = setInterval(this.listen4DB, 500)
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
        clearInterval(this.listen4LocationInterval)
      }
    }
  }

  updateLocation = () => {
    if (!this.state.recenter && !this.state.inApp && Location.lat && this.mapMounted) {
      this.setState({ location: true })
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

  buildMarkers = () => {

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
          zIndex={1005}
        />
      temp.push(marker)
    }

    this.setState({ markers: temp })
  }

  render = () => {

    let locationMarker = new window.google.maps.MarkerImage(
      './res/location-marker.png',
      null,
      null,
      null,
      new window.google.maps.Size(50, 50))

    return (
      <div className="Map">
        <div className="Search_Route">
          <li>
            <Link to='/search'>
              <img id="search-pin" src='./res/pin.png' alt='hacky'></img>
            </Link>
          </li>
        </div>
        {LightStore.length === 0 && this.mapMounted && <Search />}
        {/*center over nearest*/}
        {this.state.nearest && <GoogleMap
          zoom={15}
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
          zoom={11}
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
          zoom={11}
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
          zoom={11}
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

        <div className="Markers">
          {this.state.markers}
        </div>

        <Preview
          togglePreview={this.togglePreview}
          lightDex={this.state.lightDex}
          contributions={false}
          lights={LightStore}
        />
        <Snow />
      </div>
    );
  };
}

const MapComponent = withScriptjs(withGoogleMap(Map));
export default () => (
  <MapComponent
    googleMapURL={KeyStore.mapUrl}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `100vh`, width: "100vw" }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);
