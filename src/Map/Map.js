import React from "react";
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps";
import KeyStore from '../KeyStore'
import Location from '../Location'
import LightStore from "../LightStore";
import Preview from "../Preview/Preview"
import Radar from '../Radar'
import Search from '../Search/Search'
import { mapStyles } from './NightMode'
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
    this.listen4LocationInterval = setInterval(this.listenForLocation, 1000)
    this.updateInterval = setInterval(this.update, 1000)
    this.dbInterval = setInterval(this.listen4DB, 1000)
    this.radarInterval = setInterval(this.listen4Radar, 1000)
    this.setState({ lights: LightStore.lights })
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

  update = () => {
    if (LightStore.update.length > 0) {
      for (let i = 0; i < LightStore.update.length; i++) {
        if (LightStore.update[i] === 1) {
          this.setState({ lights: LightStore.lights })
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

  zoomChanged = () => {
    // this.dragged()
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
        {!this.state.search && LightStore.lights.length === 0 && <Search />}
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
        {this.state.location && this.state.centered && <GoogleMap
          center={{ lat: Location.lat, lng: Location.lng }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
          onZoomChanged={this.zoomChanged}
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
          onZoomChanged={this.zoomChanged}

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
          <img src="./res/search.png" alt="oops" onClick={this.toggleSearch}></img>
        </div>
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
