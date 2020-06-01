import React, { Component } from 'react'
import './Twinkle.css'

class Twinkle extends Component {

    render() {
        return (
            <div className="Twinkle">
                <div className="background-container">
                    {/* <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png" alt="fsg"></img> */}
                    <div className="stars"></div>
                    <div className="twinkling"></div>
                    {/* <div className="clouds"></div> */}
                </div>
            </div>
        )
    }

}

export default Twinkle