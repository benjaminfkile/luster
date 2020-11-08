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
import './App.css';

class App extends Component {

  userLocationTicks = 0
  locationAttempts = 0

  constructor(props) {
    super(props);
    this.state = {
      hasLocation: false,
      manualLocation: false
    }
  }

  componentDidMount() {
    this.zoneInterval = setInterval(this.getZone, 500)
  }

  getZone = () => {

    if (!Location.lat) {
      this.locationAttempts += 1
      this.setState({ hasLocation: false })
    } else {
      LightStore.length = 0
      clearInterval(this.zoneInterval)
      this.setState({ hasLocation: true })
      this.getLights(Location.lat, Location.lng)
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

    console.log(this.state)

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
        {!this.state.hasLocation && <div>
          <p>fml</p>
        </div>}
      </div>

    );
  }
}

export default App;
