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
        north: 51,
        south: 43,
        east: -103,
        west: -117,
      },
    },
    zoom: 11,
    minZoom: 6,
    maxZoom: 15
  };


  constructor(props) {
    super(props);
    this.state = {
      lights: null,
      markers: null,
      lightDex: -1,
      location: false,
      centered: false,
      dragged: true,
      nearest: false,
      inApp: true,
      target: null,
      search: false,
      outOfBounds: false
    }
  }

  componentDidMount() {
    this.inApp()//check to make sure the user didnt open on Facebook or Instagram, if true dont keep updating the location or FB/IG browser will ask for it every second
    if (window.location.pathname !== '/browse') { //I render different maps based on window.location.pathname, the map in the browsee component in basically just a background image so need to set intervals a wast memory/CPU
      this.mapMounted = true;
      this.listen4LocationInterval = setInterval(this.listenForLocation, 100)
      this.updateInterval = setInterval(this.update, 100)
      this.dbInterval = setInterval(this.listen4DB, 100)
      this.radarInterval = setInterval(this.listen4Radar, 300)
      this.setState({ lights: LightStore.lights })
    }
  }
  //checks to see if the user opened the site in Facebook or Instagram
  inApp = () => {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    if (!(ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf('Instagram') > -1)) {
      this.setState({ inApp: false })
    }
  }
  //clear all intervals on unmount
  componentWillUnmount() {
    this.mapMounted = false;
    clearInterval(this.updateInterval)
  }
  //listen for when the LightStore is populated
  listen4DB = () => {
    if (LightStore.lights.length > 0 && this.mapMounted) {
      this.setState({ lights: LightStore.lights })
      this.buildMarkers()
      clearInterval(this.dbInterval)
    }
  }
  //listen for the location to center the map over
  listenForLocation = () => {
    if (Location.coords.lat && !this.state.inApp && this.mapMounted) {
      this.setState({ location: true })
      clearInterval(this.listen4LocationInterval)
    }
    else {
      this.setState({ location: false })
      this.locationTimeout++
      if (this.locationTimeout > 19) {
        clearInterval(this.listen4LocationInterval)
      }
    }
  }
  //if the update Array in the LightStore has a 1 in it the user changed there location 
  //so rebuild markers for the new location, close search if it open and set the lightDex to -1
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
  //update the the state of target so the user can center the map over the nearest marker
  listen4Radar = () => {
    if (Radar.targets.length > 0 && this.mapMounted) {
      this.setState({ target: Radar.targets[0][0] })
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
  //toggle the preview based on the lightDex
  togglePreview = (args) => {
    this.setState({ lightDex: args })
  }
  //opens or closes the search component
  toggleSearch = () => {
    if (this.state.search) {
      this.setState({ search: false, lightDex: -1 })
    } else {
      this.setState({ search: true, lightDex: -1 })
    }
  }
  //creates the map markers
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
        {this.state.nearest && Radar.targets[0][1].lat && Location.coords.lat && <GoogleMap
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
        {this.state.centered && window.location.pathname !== '/browse' && Location.coords.lat && <GoogleMap
          center={{ lat: Location.coords.lat, lng: Location.coords.lng }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
        >
          <>
            {<Marker
              position={{ lat: Location.coords.lat, lng: Location.coords.lng }}
              icon={locationMarker}
            />}
          </>
        </GoogleMap>}

        {/*user drags map*/}
        {this.state.dragged && window.location.pathname !== '/browse' && Location.coords.lat && <GoogleMap
          defaultCenter={{ lat: Location.coords.lat, lng: Location.coords.lng }}
          defaultOptions={this.defaultMapOptions}
          onDrag={this.dragged}
        >
          <>
            {!this.state.nearest && <Marker
              position={{ lat: Location.coords.lat, lng: Location.coords.lng }}
              icon={locationMarker}
            />}
          </>
        </GoogleMap>}

        {/*no location yet, center over Missoula*/}
        {!Location.coords.lat && <GoogleMap
          defaultCenter={{ lat: 46.8721, lng: -113.9940 }}
          defaultOptions={this.defaultMapOptions}
        >
          <>
          </>
        </GoogleMap>}

        {/*window.location.pathname === browse, render a map centered over user location that doesnt do anything for a background picture*/}
        {window.location.pathname === '/browse' && Location.coords.lat && <GoogleMap
          defaultCenter={{ lat: Location.coords.lat, lng: Location.coords.lng }}
          defaultOptions={this.defaultMapOptions}
        >
          <>
          </>
        </GoogleMap>}

        {/*dont render buttons for recenter or nearest if window.location.pathname === browse*/}
        {window.location.pathname !== '/browse' && !this.state.search && this.state.lightDex === -1 && Location.coords.lat && <div className="Map_Controls">
          {!this.state.centered && this.state.location && <div className="Recenter" onClick={this.recenter}>
            <p>Recenter</p>
          </div>}
          {!this.state.nearest && <div className="Nearest" onClick={this.findNearest}>
            <p>Nearest</p>
          </div>}
        </div>}

        {/*dont render markers the window.location.pathname === browse*/}
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