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
      </div>

    );
  }
}

export default App;
