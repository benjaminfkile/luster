import React, { Component } from 'react'
import './RadarAnimation.css'

//credit http://jsfiddle.net/cctiger36/NZMBb/

class RadarAnimation extends Component {
    render() {
        return (
            <div className="razar">
                <div className="ringbase ring1"></div>
                <div className="ringbase ring2"></div>
                <div className="pulse"></div>
                <div className="pointer">
                    <div></div>
                </div>
                <div className="dot pos1"></div>
                <div className="dot pos2"></div>
            </div>
        )
    }
}

export default RadarAnimation