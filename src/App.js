import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import Post from './Post/Post'
import Browse from './Browse/Browse'
import Help from './Help/Help'
import Map from './Map/Map'
import Nav from './Nav/Nav'
import './App.css';

class App extends Component {

  inApp = () => {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf('Instagram') > -1);
  }

  render() {

    return (
      <div className="Wrapper">
        {!this.inApp() && <div className="App">
          <Nav />
          <Switch>
            <Route exact path='/' component={Map} />
            <Route path='/post' component={Post} />
            <Route path='/browse' component={Browse} />
            <Route path='/help' component={Help} />
            <Route component={Map} />
          </Switch>
        </div>}
        {this.inApp() && <div className="Redirect">
          Click the button below to leave facebook
        <br></br>
          <a href="https://luster.vercel.app" target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" height={50} width={50} /> &nbsp;</a>
        </div>}
      </div>

    );
  }
}

export default App;
