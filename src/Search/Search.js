import React, { Component } from 'react'
import ApiStore from '../ApiStore'
import KeyStore from "../KeyStore"
import Location from '../Location'
import LightStore from '../LightStore'
import Geocode from "react-geocode";
import "./Search.css"
Geocode.setApiKey(KeyStore.googleKey);
Geocode.setLanguage("en");

class Search extends Component {

  searchRadius = 3
  mounted = false

  constructor(props) {
    super(props);
    this.state = {
      hasLocation: false,
      address: '',
      input: '',
      placeholder: "",
      results: [],
      typing: false,
      typingTimeout: 0,
      geoLat: 37.0902,
      geoLng: -95.7129,
      lat: null,
      lng: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.clearPlaceholder = this.clearPlaceholder.bind(this);
  }

  componentDidMount() {
    this.mounted = true
    this.zoneInterval = setInterval(this.getZone, 500)
  }

  componentWillUnmount() {
    this.mounted = false
  }

  getZone = () => {
    if (!this.props.toggled && this.mounted) {
      if (!Location.coords.lat) {
        this.setState({ hasLocation: false })
      } else {
        LightStore.lights.length = 0
        clearInterval(this.zoneInterval)
        this.setState({ hasLocation: true })
        this.getLights(Location.coords.lat, Location.coords.lng, this.searchRadius)
      }
    } else {
      clearInterval(this.zoneInterval)
      this.getLights(Location.coords.lat, Location.coords.lng, this.searchRadius)
      window.haltLocation = true
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
    Location.coords.lat = this.state.lat
    Location.coords.lng = this.state.lng
    Location.accuracy = 0
    this.getLights(this.state.lat, this.state.lng, this.searchRadius)
    // LightStore.update.unshift(1)
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
    if (input !== "") {
      let temp = []
      this.setState({ results: null })
      let targetUrl = ApiStore + '/api/places/' + input.split(' ').join('+')
      fetch(targetUrl)
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
    let targetUrl = ApiStore + '/api/lights/' + lat + ',' + lng + ',' + rad;
    console.log(targetUrl)
    fetch(targetUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length < 1) {
          this.searchRadius += 5
          // if (this.searchRadius > 100) {
          //   this.setState({ hasLocation: false })
          //   this.searchRadius = 3
          //   console.log('nothing found')
          //} else {
          this.getLights(lat, lng, this.searchRadius)
          //}
        } else {
          LightStore.lights.length = 0
          for (let i = 0; i < data.length; i++) {
            if (data[i].on === 't') {
              // if (i > 300) { break; }
              LightStore.lights.push(data[i])
            }
          }
        }
      }).catch(error => alert('Sorry the service is down \n:(\nPlease try again later'));
  }

  render() {
    return (
      <div>
        {!this.state.hasLocation && <div className="Search">
          {this.state.results && this.state.results.length === 0 && !this.props.toggled && <h2>Mannually Set Search Point</h2>}
          {this.state.results && this.state.results.length === 0 && this.props.toggled && <h2>Search</h2>}
          <input id="search-input" type="text" value={this.state.input} placeholder={this.state.placeholder} onClick={this.clearPlaceholder} onChange={this.handleChange} />
          {this.state.results && this.state.results.length === 0 && !this.props.toggled && <h3>You havent allowed Lightmaps your location which is fine, you can set your search point manually.</h3>}
          {this.state.results && this.state.results.length === 0 && this.props.toggled && <h3>Explore other places.</h3>}
          {this.state.results && <div className="Suggestion_Container">
            {this.state.results.map((result, i) =>
              <p className="Suggestion" key={i} onClick={() => this.convertAddressToCoords(result)}>{result}</p>
            )}
          </div>}
          {this.state.lat && this.state.address !== '' && <div className="Selection">
            <p id="suggestion">Location:</p>
            <p id="suggestion1">{this.state.address}</p>
            <p id="coords2">Location Coordinates:</p>
            <p id="coords3">{this.convertDMS(this.state.lat, this.state.lng)}</p>
            <div className="Yes_Option1" onClick={this.useAddress}>
              <img id="use-img" src="./res/yes.png" alt="oops" />
              <p>Use</p>
            </div>
            <div className="No_Option1" onClick={this.discardAddress}>
              <img id="use-img" src="./res/no.png" alt="oops" />
              <p>Clear</p>
            </div>
          </div>}
        </div>}
        {/* <Snow /> */}
      </div>
    )
  }

}

export default Search