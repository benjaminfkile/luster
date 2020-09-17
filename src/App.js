import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import InApp from './InApp/InApp'
import Post from './Post/Post'
import Browse from './Browse/Browse'
import Help from './Help/Help'
import Map from './Map/Map'
import Nav from './Nav/Nav'
import './App.css';

class App extends Component {

  componentDidMount() {
    
    window.onload = () => {

      var desktopFallback = "https://luster.vercel.app/",
        mobileFallback = "https://luster.vercel.app/",
        app = "https://luster.vercel.app/";

      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location = app;
        window.setTimeout(function () {
          window.location = mobileFallback;
        }, 25);
      } else {
        window.location = desktopFallback;
      }

      function killPopup() {
        window.removeEventListener('pagehide', killPopup);
      }

      window.addEventListener('pagehide', killPopup);

    };
  }

  render() {

    return (
      <div className="Wrapper">
        <div className="App">
          <Nav />
          <Switch>
            <Route exact path='/' component={Map} />
            <Route path='/post' component={Post} />
            <Route path='/browse' component={Browse} />
            <Route path='/help' component={Help} />
            <Route component={Map} />
          </Switch>
        </div>
        {/* {this.state.inApp && <InApp
          dismiss={this.inAppDismiss}
        />} */}
      </div>

    );
  }
}

export default App;
