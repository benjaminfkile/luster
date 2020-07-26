import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import About from './About/About'
import Browse from './Browse/Browse'
import Contribute from './Contribute/Contribute'
import Help from './Help/Help'
// import MapContainer from './Map/MapContainer'
import ReactMap from './ReactMap/Map'
import Nav from './Nav/Nav'
import './App.css';


class App extends Component {

  render() {
    return (
      <div className="App">
        <Nav />
        <Switch>
          <Route exact path='/' component={ReactMap} />
          <Route path='/about' component={About} />
          <Route path='/browse' component={Browse} />
          <Route path='/contribute' component={Contribute} />
          <Route path='/help' component={Help} />
          <Route component={ReactMap} />
        </Switch>
      </div>
    );
  }


}
export default App;
