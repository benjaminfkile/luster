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

  // state = {
  //   inApp: true
  // }

  // componentDidMount(){
  //   if(!this.inApp()){
  //     this.setState({inApp: false})
  //   }else{
  //     this.setState({inApp: true})
  //   }
  // }

  // inAppDismiss = () => {
  //   this.setState({inApp: false})
  // }

  // inApp = () => {
  //   var ua = navigator.userAgent || navigator.vendor || window.opera;
  //   return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf('Instagram') > -1)
    
  // }

  render() {

    return (
      <div className="Wrapper">
        {/*!this.state.inApp &&*/ <div className="App">
          <Nav />
          <Switch>
            <Route exact path='/' component={Map} />
            <Route path='/post' component={Post} />
            <Route path='/browse' component={Browse} />
            <Route path='/help' component={Help} />
            <Route component={Map} />
          </Switch>
        </div>}
        {/* {this.state.inApp && <InApp
        dismiss = {this.inAppDismiss}
        />} */}
      </div>

    );
  }
}

export default App;
