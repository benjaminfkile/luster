import React, { Component } from 'react'
import Snow from '../Snow/Snow'
import '../InApp/InApp.css'

class InApp extends Component {

    constructor() {
        super();
        this.state = {
            lightDex: -1,
            db: false,
            showFeed: true,
        }
    }

    render() {
        return (
            <div className="InApp">
                <section id="notice">
                    <h1 id="welcome">
                        Welcome to Luster
                </h1>
                    <h2>
                        You seem to be viewing this page inside of Facebook which is fine. If you want more features open it in your devices web browser
                </h2>
                    <h3 id="dismiss" onClick={this.props.dismiss}>
                        DISMISS
                </h3>
                <br></br>
                <h2>
                    or...
                </h2>
                    <h3 id="full-power">
                        Want the full power of Luster?
                </h3>
                <br></br>
                    <h2>
                        Select the menu in the upper right hand corner and choose "Open with...".
                </h2>
                    <img src="https://i.ibb.co/w6yjKj1/1b311df9-c030-419c-849c-592456720d1e.png"></img>
                </section>
                {/* <Snow/> */}
            </div>
        )
    }
}

export default InApp

