import React, { Component } from 'react'
import Map from '../Map/Map'
import LightStore from '../LightStore'
import { mapStyles } from '../Map/NightMode.js'
import Snow from '../Snow/Snow'
import Location from '../Location'

import '../Map/Map.css'

class MapContainer extends Component {

  dbInterval
  localInterval

  constructor() {
    super();
    this.state = {
      lights: [],
      centerLat: 46.833,
      centerLng: -114.030,

    }
  }

  componentDidMount() {
    this.dbInterval = setInterval(this.listen4DB, 1000)
    this.localInterval = setInterval(this.listen4Location, 1000)

  }

  listen4DB = () => {
    console.log('asfs')
    if (LightStore[0].length > 0) {
      this.setState({ lights: LightStore[0] })
      clearInterval(this.dbInterval)
    }
  }

  listen4Location = () => {
    console.log(Location)
    if (Location.lat) {
      this.setState({ centerLat: Location.lat, centerLng: Location.lng })
      // clearInterval(this.localInterval)
    }
  }

  render() {

    return (

      <div className="Map_Container">
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Mountains+of+Christmas" />

        {this.state.lights.length === 0 &&

          <div className="Splash_Screen">
            <h1>
              Fetching Lights
           </h1>
            <br></br>
            <h2>
              please wait...
           </h2>
            <img src="./res/splash.png" alt='A tree'></img>
          </div>
        }

        {this.state.lights.length > 0 &&
          <Map
            id="Map"
            options={{
              // center: { lat: this.state.centerLat, lng: this.state.centerLng },
              center: { lat: this.state.centerLat, lng: this.state.centerLng },
              zoom: 13,
              fullscreenControl: false,
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              styles: mapStyles
            }}
            onMapLoad={map => {
              for (let i = 0; i < this.state.lights.length; i++) {
                let mapIcon = new window.google.maps.MarkerImage(
                  './res/' + Math.floor((Math.random() * (23 - 1) + 1)) + '.png',
                  null,
                  null,
                  null,
                  new window.google.maps.Size(40, 40)
                );
                const marker = new window.google.maps.Marker(
                  {
                    position: { lat: parseFloat(this.state.lights[i].lat), lng: parseFloat(this.state.lights[i].lng) },
                    map: map,
                    label: '',
                    icon: mapIcon
                  });
                marker.addListener('click', e => {
                  this.setState({ picture: this.state.lights[i].url });
                  this.setState({ targetLat: this.state.lights[i].lat });
                  this.setState({ targetLng: this.state.lights[i].lng });
                  this.setState({ targetRating: this.state.lights[i].rating });
                  this.setState({ showPictureBox: true });
                })
              }
            }}
          />}
          }
        <Snow
        // credit to https://pajasevi.github.io/CSSnowflakes/
        />
      </div>
    );
  }
}

export default MapContainer;

