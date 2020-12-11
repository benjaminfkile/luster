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
  }

  componentDidMount() {
    this.getLocationInterval = setInterval(this.getLocation, 500)
  }
  //sets the location to center the map over 
  customLocation = (lat, lng, rad) => {
    window.haltLocation = true //creates a window variable and sets it to true, when Location.js sees this it will stop updating the users location
    Location.coords.lat = lat
    Location.coords.lng = lng
    this.getLights(Location.coords.lat, Location.coords.lng, rad)
    LightStore.update.unshift(1) //ad a 1 to the update array in LightStore.js
  }
  //listens for when a location has been set
  getLocation = () => {
    if (Location.coords.lat) {
      this.getLights(Location.coords.lat, Location.coords.lng, 1)
      clearInterval(this.getLocationInterval)
    }
  }
  //for now the API is modified to return all the rows in the DB,  if the DB becomes too large that the user would have a poor experience proccessing all the images
  //then recursively call the API untill it finds lights near them or untill the search radius > 30, this will create a kind of ripple effect search that will cover
  //the surface area of montana
  getLights = (lat, lng, rad) => {
    let targetUrl = ApiStore + '/api/lights/' + lat + ',' + lng + ',' + rad;
    fetch(targetUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length < 1) {
          this.searchRadius += 5
          if (this.searchRadius > 30) {
            this.searchRadius = 1
            alert('nothing found')
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