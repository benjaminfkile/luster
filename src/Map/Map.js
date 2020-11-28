import React, { Component } from "react";
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps";
import KeyStore from '../KeyStore'
import Location from '../Location'
import LightStore from "../LightStore";
import Preview from "../Preview/Preview"
import Radar from '../Radar'
import Search from '../Search/Search'
import { mapStyles } from './NightMode'
import '../Map/Map.css'

class Map extends Component {

  locationTimeout = 0
  mapMounted = false;
  defaultMapOptions = {
    styles: mapStyles,
    fullscreenControl: false,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    gestureHandling: 'greedy',
    restriction: {
      latLngBounds: {
        north: 49.00139,
        south: 44.358221,
        east: -104.039138,
        west: -116.050003,
      },
    },
    zoom: 11,
    minZoom: 8,
    maxZoom: 15
  };


  constructor(props) {
    super(props);
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
      search: false,
      outOfBounds: false
    }
  }

  componentDidMount() {
    this.inApp()
    if (window.location.pathname !== '/browse') {
      this.mapMounted = true;
      this.listen4LocationInterval = setInterval(this.listenForLocation, 1000)
      this.updateInterval = setInterval(this.update, 1000)
      this.dbInterval = setInterval(this.listen4DB, 1000)
      this.radarInterval = setInterval(this.listen4Radar, 1000)
      this.setState({ lights: LightStore.lights })
    }
  }

  inApp = () => {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    if (!(ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf('Instagram') > -1)) {
      this.setState({ inApp: false })
    }
  }

  componentWillUnmount() {
    this.mapMounted = false;
    clearInterval(this.updateInterval)
  }

  listen4DB = () => {
    if (LightStore.lights.length > 0 && this.mapMounted) {
      this.setState({ lights: LightStore.lights })
      this.buildMarkers()
      clearInterval(this.dbInterval)
    }
  }

  listenForLocation = () => {
    if (Location.coords.lat && !this.state.inApp && this.mapMounted) {
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

  update = () => {
    if (LightStore.update.length > 0) {
      for (let i = 0; i < LightStore.update.length; i++) {
        if (LightStore.update[i] === 1) {
          this.setState({ lights: LightStore.lights, lightDex: -1, search: false })
          this.recenter()
          this.buildMarkers()
        }
      }
    }
  }

  listen4Radar = () => {
    if (Radar.targets.length > 0 && this.mapMounted) {
      this.setState({ target: Radar.targets[0][0] })
      //clear interval????
    }
  }

  findNearest = () => {
    this.setState({ nearest: true, dragged: true, centered: false })
  }

  recenter = () => {
    this.setState({ centered: true, dragged: false, nearest: false })
  }

  dragged = () => {
    this.setState({ centered: false, dragged: true, nearest: false })
  }

  zoomChanged = () => {
    this.setState({ centered: false, dragged: true })
  }

  togglePreview = (args) => {
    this.setState({ lightDex: args })
  }

  toggleSearch = () => {
    if (this.state.search) {
      this.setState({ search: false, lightDex: -1 })
    } else {
      this.setState({ search: true, lightDex: -1 })
    }
  }

  buildMarkers = () => {
    let temp = []
    for (let i = 0; i < this.state.lights.length; i++) {
      let markerImg = new window.google.maps.MarkerImage(
        './res/' + this.state.lights[i].pin + '.png',
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
        {!this.state.search && LightStore.lights.length === 0 && window.location.pathname !== '/browse' && <Search />}
        {this.state.search && <Search toggled={true} />}
        {/*center over nearest*/}
        {this.state.nearest && Radar.targets[0][1].lat && <GoogleMap
          center={{ lat: Number(Radar.targets[0][1].lat), lng: Number(Radar.targets[0][1].lng) }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
          onZoomChanged={this.zoomChanged}
        >
          <>
          </>
          <Marker
            position={{ lat: Number(Radar.targets[0][1].lat), lng: Number(Radar.targets[0][1].lng) }}
            icon={locationMarker}
          />
        </GoogleMap>}

        {/*center over location*/}
        {this.state.location && this.state.centered && window.location.pathname !== '/browse' && <GoogleMap
          center={{ lat: Location.coords.lat, lng: Location.coords.lng }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
          onZoomChanged={this.zoomChanged}
        >
          <>
            {this.state.location && <Marker
              position={{ lat: Location.coords.lat, lng: Location.coords.lng }}
              icon={locationMarker}
            />}
          </>
        </GoogleMap>}

        {/*has Location and user drags map*/}
        {this.state.location && this.state.dragged && window.location.pathname !== '/browse' && <GoogleMap
          defaultCenter={{ lat: Location.coords.lat, lng: Location.coords.lng }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
          onZoomChanged={this.zoomChanged}

        >
          <>
            {!this.state.nearest && <Marker
              position={{ lat: Location.coords.lat, lng: Location.coords.lng }}
              icon={locationMarker}
            />}
          </>
        </GoogleMap>}

        {/*no Location, center of Montana*/}
        {!this.state.location && window.location.pathname !== '/browse' && <GoogleMap
          defaultCenter={{ lat: 46.8721, lng: -113.9940 }}
          defaultOptions={this.defaultMapOptions}
        >
          <>
          </>
        </GoogleMap>}

        {!this.state.location && window.location.pathname === '/browse' && <GoogleMap
          defaultCenter={{ lat: 46.8721, lng: -113.9940 }}
          defaultOptions={this.defaultMapOptions}
        >
          <>
          </>
        </GoogleMap>}

        {this.state.location && window.location.pathname === '/browse' && <GoogleMap
          defaultCenter={{ lat: 46.8721, lng: -113.9940 }}
          defaultOptions={this.defaultMapOptions}
        >
          <>
          </>
        </GoogleMap>}

        {window.location.pathname !== '/browse' && <div className="Map_Controls">
          {!this.state.centered && this.state.location && <div className="Recenter" onClick={this.recenter}>
            <p>Recenter</p>
          </div>}
          {!this.state.nearest && <div className="Nearest" onClick={this.findNearest}>
            <p>Nearest</p>
          </div>}
        </div>}

        {window.location.pathname !== '/browse' && <div className="Search_Toggle">
          <img src="./res/search.png" alt="oops" onClick={this.toggleSearch}></img>
        </div>}
        <div className="Markers">
          {(!this.state.search && this.state.lightDex === -1) && this.state.markers}
        </div>

        <Preview
          togglePreview={this.togglePreview}
          lightDex={this.state.lightDex}
          contributions={false}
          lights={LightStore.lights}
        />
        {/* <Snow /> */}
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