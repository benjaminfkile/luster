import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import PostAddress from './Post/Post'
import Browse from './Browse/Browse'
import Profile from './Profile/Profile'
import Map from './Map/Map'
import Nav from './Nav/Nav'
import './App.css';

class App extends Component {

  componentDidMount() {
    window.user = "510295233cd1919aa43736c145e077a4"
    window.name = "Ben"
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
