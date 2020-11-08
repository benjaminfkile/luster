import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import PostAddress from './Post/Post'
import Browse from './Browse/Browse'
import Profile from './Profile/Profile'
import Map from './Map/Map'
import Nav from './Nav/Nav'
import api from './api'
import GeoData from './GeoData'
import LightStore from './LightStore'
import './App.css';

class App extends Component {

  userLocationTicks = 0
  geoLocationTicks = 0

  componentDidMount() {
    this.zoneInterval = setInterval(this.getZone, 500)
    //   window.user = "510295233cd1919aa43736c145e077a4"
    //   window.name = "Ben"
  }

  getZone = () => {

    if (GeoData.length === 0) {
      this.geoLocationTicks += 1
      if (this.userLocationTicks > 10) {
        console.log('failed to fetch geo data')
      }
    } else {
      LightStore.length = 0
      clearInterval(this.zoneInterval)
      this.getLights(GeoData[0].latitude, GeoData[0].longitude)
    }
  }

  getLights = (lat, lng) => {
    let targetUrl = api + '/api/lights/' + lat + ',' + lng;
    fetch(targetUrl)
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].on === 't') {
            LightStore.push(data[i])
          }
        }
      })
      .catch(error => alert('Sorry the service is down \n:(\nPlease try again later'));
  }

  render() {

    return (
      <div className="Wrapper">
        <div className="App">
          <Nav />
          <Switch>
            <Route exact path='/' component={Map} />
            <Route path='/post' component={PostAddress} />
            <Route path='/browse' component={Browse} />
            <Route path='/profile' component={Profile} />
            <Route component={Map} />
          </Switch>
        </div>
      </div>

    );
  }
}

export default App;
