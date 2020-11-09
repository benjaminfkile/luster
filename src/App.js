import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import PostAddress from './Post/Post'
import Browse from './Browse/Browse'
import Profile from './Profile/Profile'
import Map from './Map/Map'
import Nav from './Nav/Nav'
import api from './api'
import Location from './Location'
import LightStore from './LightStore'
import RadarAnimation from './Browse/RadarAnimation'
import Snow from './Snow/Snow'
import './App.css';
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyAj6zqW55nq95JI6gGGj-BtkN_hfZhJScM");
Geocode.setLanguage("en");

class App extends Component {

  searchRadius = 3

  constructor(props) {
    super(props);
    this.state = {
      hasLocation: false,
      address: '',
      input: '',
      placeholder: "Search address",
      results: [],
      typing: false,
      typingTimeout: 0,
      geoLat: 37.0902,
      geoLng: -95.7129,
      lat: null,
      lng: null,
      accurateLocation: false,
      locationAccuracy: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.clearPlaceholder = this.clearPlaceholder.bind(this);
  }

  componentDidMount() {
    this.zoneInterval = setInterval(this.getZone, 500)
    // window.user = "510295233cd1919aa43736c145e077a4"
    // window.name = "Ben"
  }

  getZone = () => {
    if (!Location.lat) {
      this.setState({ hasLocation: false })
    } else {
      LightStore.length = 0
      clearInterval(this.zoneInterval)
      this.setState({ hasLocation: true })
      this.getLights(Location.lat, Location.lng, this.searchRadius)
    }
  }

  convertAddressToCoords = (address) => {
    Geocode.fromAddress(address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({ lat: lat, lng: lng, address: address, results: null })
      },
      error => {
        console.error(error);
      }
    );
  }

  toDegreesMinutesAndSeconds = (coordinate) => {
    let absolute = Math.abs(coordinate);
    let degrees = Math.floor(absolute);
    let minutesNotTruncated = (absolute - degrees) * 60;
    let minutes = Math.floor(minutesNotTruncated);
    let seconds = Math.floor((minutesNotTruncated - minutes) * 60);
    return degrees + '\u00BA ' + minutes + '\u0027 ' + seconds + '\u0022';
  }

  convertDMS = (lat, lng) => {
    let latitude = this.toDegreesMinutesAndSeconds(lat);
    let latitudeCardinal = lat >= 0 ? 'N' : 'S';
    let longitude = this.toDegreesMinutesAndSeconds(lng);
    let longitudeCardinal = lng >= 0 ? 'E' : 'W';
    return latitude + ' ' + latitudeCardinal + '\n' + longitude + ' ' + longitudeCardinal;
  }

  useAddress = () => {
    this.setState({ hasLocation: true })
    Location.lat = this.state.lat
    Location.lng = this.state.lng
    Location.accuracy = 0
    this.getLights(this.state.lat, this.state.lng, this.searchRadius)
  }

  discardAddress = () => {
    this.setState({ address: '', input: '', results: [], lat: null, lng: null })
  }

  clearPlaceholder = () => {
    this.setState({ placeholder: "" })
  }

  handleChange = (event) => {
    const self = this;

    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout);
    }

    self.setState({
      input: event.target.value,
      typing: false,
      typingTimeout: setTimeout(function () {
        self.searchAddress(self.state.input);
      }, 1000)
    });
  }

  searchAddress = (input) => {
    console.log('no input')
    if (input !== "") {
      console.log("searching addresses")
      let temp = []
      this.setState({ results: null })
      let targetUrl = "https://maps.googleapis.com/maps/api/place/queryautocomplete/json?location=" + this.state.geoLat + "," + this.state.geoLng + "&radius=" + this.state.radius + "&key=AIzaSyAj6zqW55nq95JI6gGGj-BtkN_hfZhJScM&input=" + input.split(' ').join('+')
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      fetch(proxyurl + targetUrl)
        .then(res => res.json())
        .then(res => {
          for (let i = 0; i < res.predictions.length; i++) {
            temp.push(res.predictions[i].description)
          }
          this.setState({ results: temp, address: '', lat: null, lng: null })
        })
        .catch(() => console.log("Can’t access " + targetUrl + " response. Blocked by browser?"))
    } else {
      this.setState({ results: [], address: '', lat: null, lng: null })
    }
  }

  getLights = (lat, lng, rad) => {
    let targetUrl = api + '/api/lights/' + lat + ',' + lng + ',' + rad;
    fetch(targetUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length === 0) {
          this.searchRadius += 3
          if(this.searchRadius > 99){
            alert('nothing found near you')
          }else{
            this.getLights(lat, lng, this.searchRadius)
          }
        } else {
          for (let i = 0; i < data.length; i++) {
            if (data[i].on === 't') {
              LightStore.push(data[i])
            }
          }
        }
      })
      .catch(error => alert('Sorry the service is down \n:(\nPlease try again later'));
  }

  render() {

    return (
      <div className="Wrapper">
        {this.state.hasLocation && <div className="App">
          <Nav />
          <Switch>
            <Route exact path='/' component={Map} />
            <Route path='/post' component={PostAddress} />
            <Route path='/browse' component={Browse} />
            <Route path='/profile' component={Profile} />
            <Route component={Map} />
          </Switch>
        </div>}
        {!this.state.hasLocation && <div className="Location_Denied">
          <h2>Welcome to LightMaps!</h2>
          <input type="text" value={this.state.input} placeholder={this.state.placeholder} onClick={this.clearPlaceholder} onChange={this.handleChange} />
          {this.state.results && this.state.results.length === 0 && <h3>I dont have your location which is fine, you can search for locations instead.</h3>}
          {this.state.results && <div className="Address_Container">
            {this.state.results.map((result, i) =>
              <p className="Address_Suggestion" key={i} onClick={() => this.convertAddressToCoords(result)}>{result}</p>
            )}
          </div>}
          {this.state.lat && this.state.address !== '' && <div className="Selection">
            <p id="address">Your Location:</p>
            <p id="address1">{this.state.address}</p>
            <p id="coords">Location Coordinates:</p>
            <p id="coords1">{this.convertDMS(this.state.lat, this.state.lng)}</p>
            <div className="Yes_Option" onClick={this.useAddress}>
              <img id="use-img" src="./res/yes.png" alt="oops" />
              <p>Use</p>
            </div>
            <div className="No_Option" onClick={this.discardAddress}>
              <img id="use-img" src="./res/no.png" alt="oops" />
              <p>Clear</p>
            </div>
          </div>}
          {this.state.results && this.state.results.length === 0 && <RadarAnimation />}
          <Snow />
        </div>}
      </div>
    );
  }
}

export default App;
