import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom'
import About from './About/About'
import Browse from './Browse/Browse'
import Contribute from './Contribute/Contribute'
import Help from './Help/Help'
import MapContainer from './Map/MapContainer'
import Nav from './Nav/Nav'
import Snow from './Snow/Snow'

import './App.css';

class App extends Component {


  render(){
    return (
      <div className="App">
        <Nav />
        <Switch>
          <Route exact path='/' component={MapContainer} />
          <Route path='/about' component={About} />
          <Route path='/browse' component={Browse} />
          <Route path='/contribute' component={Contribute} />
          <Route path='/help' component={Help} />
          <Route component={MapContainer} />
        </Switch>
        <Snow
        // credit to https://pajasevi.github.io/CSSnowflakes/
        />
      </div>
    );
  }


}

export default App;
