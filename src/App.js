import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import Post from './Post/Post'
import Browse from './Browse/Browse'
import Login from './Login/Login'
import Map from './Map/Map'
import Nav from './Nav/Nav'
import './App.css';

class App extends Component {

  // componentDidMount(){
  //   window.user = "4e8c5e274de36d5acb5567ca8193626c"
  //   window.name = "Ben"
  // }

  render() {

    return (
      <div className="Wrapper">
        <div className="App">
          <Nav />
          <Switch>
            <Route exact path='/' component={Map} />
            <Route path='/post' component={Post} />
            <Route path='/browse' component={Browse} />
            <Route path='/login' component={Login} />
            <Route component={Map} />
          </Switch>
        </div>
      </div>

    );
  }
}

export default App;
