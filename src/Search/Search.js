import React, { Component } from 'react'
import ApiStore from '../ApiStore'
import Location from '../Location'
import LightStore from '../LightStore'
import CityStore from '../CityStore'
import "./Search.css"

class Search extends Component {

  searchRadius = 1
  mounted = false
  searchResults = []

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      placeholder: 'search',
      results: [],
      hasInput: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.clearPlaceholder = this.clearPlaceholder.bind(this);
  }

  componentDidMount() {
    this.getLocationInterval = setInterval(this.getLocation, 500)
  }

  handleChange = (event) => {
    this.setState({ input: event.target.value })
    this.filter(event.target.value)
  }

  clearPlaceholder = () => {
    this.setState({ placeholder: '' })
  }

  filter = (input) => {
    this.searchResults = []
    this.setState({ results: this.searchResults })
    if (input && input.length > 0) {
      for (let i = 0; i < CityStore.length; i++) {
        if (input.substring(0, input.length).toUpperCase() === CityStore[i].city.substring(0, input.length).toUpperCase()) {
          this.searchResults.push(CityStore[i])
        }
      }
    }
    this.setState({ results: this.searchResults })
  }

  customLocation = (lat, lng, rad) => {
    window.haltLocation = true
    Location.coords.lat = lat
    Location.coords.lng = lng
    this.getLights(Location.coords.lat, Location.coords.lng, rad)
      LightStore.update.unshift(1)
  }

  getLocation = () => {
    if (Location.coords.lat) {
      this.getLights(Location.coords.lat, Location.coords.lng, 1)
      clearInterval(this.getLocationInterval)
    }
  }

  getLights = (lat, lng, rad) => {
    let targetUrl = ApiStore + '/api/lights/' + lat + ',' + lng + ',' + rad;
    fetch(targetUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length < 1) {
          this.searchRadius += 1
          if (this.searchRadius > 9) {
            this.searchRadius = 1
            console.log('nothing found')
            this.searchRadius = 1
          } else {
            this.getLights(lat, lng, this.searchRadius)
          }
        } else {
          LightStore.lights.length = 0
          for (let i = 0; i < data.length; i++) {
            if (data[i].on === 't') {
              LightStore.lights.push(data[i])
            }
          }
          this.searchRadius = 1
        }
      }).catch(error => alert('Sorry the service is down \n:(\nPlease try again later'));
  }

  render() {
    return (
      <div className="Search">
        <h2>Search</h2>
        <input id="search-input" type="text" autoComplete="off" value={this.state.input} placeholder={this.state.placeholder} onClick={this.clearPlaceholder} onChange={this.handleChange} />
        {this.state.results.length > 0 && <div className="Suggestion_Container">
          {this.state.results.map((result, i) =>
              <p className="Suggestion" key={i} onClick={() => this.customLocation(this.state.results[i].lat, this.state.results[i].lng, 1, result.city)}>{result.city}</p>
          )}
        </div>}
      </div>
    )
  }
}

export default Search