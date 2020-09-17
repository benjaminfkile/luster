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

    openInBrowser = () => {
        window.open('https://luster.vercel.app/', '_system')
    }

    render() {
        return (
            <div className="InApp">
                <section id="notice">
                    <h1>
                        Welcome to Luster!
                </h1>
                    <h2>
                        You seem to be viewing this page inside of Facebook which is fine, if you want more features open it in your devices web browser
                </h2>
                    <h3 onClick={this.props.dismiss}>
                        DISMISS
                </h3>
                    <h2>
                        or..
                </h2>
                <h3 onClick={this.openInBrowser}>
                        OPEN IN BROWSER
                </h3>
                </section>
                {/* <Snow/> */}
            </div>
        )
    }
}

export default InApp

