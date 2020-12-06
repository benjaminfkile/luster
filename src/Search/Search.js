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
      cities: CityStore,
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
        <h2>Choose City</h2>
        {this.state.cities.length > 0 && <div className="Suggestion_Container">
          {this.state.cities.map((city, i) =>
              <p className="Suggestion" key={i} onClick={() => this.customLocation(this.state.cities[i].lat, this.state.cities[i].lng, 1, city.city)}>{city.city}</p>
          )}
        </div>}
      </div>
    )
  }
}

export default Search